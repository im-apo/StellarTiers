const tierPoints = {
   RHT0: 200, RLT0: 100,
   HT0: 200, LT0: 100,
   RHT1: 85, RLT1: 70,
   HT1: 85, LT1: 70,
   RHT2: 50, RLT2: 40,
   HT2: 50, LT2: 40,
   RHT3: 20, RLT3: 15,
   HT3: 20, LT3: 15,
   RHT4: 8, RLT4: 6,
   HT4: 8, LT4: 6,
   RHT5: 4, RLT5: 2,
   HT5: 4, LT5: 2,
   RHT6: -10, RLT6: -20,
   HT6: -10,  LT6: -20
};

let players = [];
let currentGamemode = "overall";

async function loadPlayers() {
  const res = await fetch("https://207a685c-33f7-4709-a247-101f6a05420a-00-nsnc0sy5rpo5.picard.replit.dev/players.json");
  players = await res.json();
  renderPlayers();
}

function calculatePoints(player) {
  let total = 0;
  for (const mode in player.tiers) {
    total += tierPoints[player.tiers[mode]] || 0;
  }
  return total;
}

document.getElementById("copyIpBtn").addEventListener("click", () => {
  navigator.clipboard.writeText("fadedmc.net");
  const popup = document.getElementById("copyPopup");
  popup.style.display = "block";
  setTimeout(()=> popup.style.display="none", 2000);
});

function getBadge(points) {
  if (points >= 300) return {label:"Legendary", class:"legendary"};
  if (points >= 200) return {label:"Master", class:"master"};
  if (points >= 100) return {label:"Expert", class:"expert"};
  if (points >= 50)  return {label:"Advanced", class:"advanced"};
  if (points >= 20)  return {label:"Intermediate", class:"intermediate"};
  return {label:"Novice", class:"novice"};
}

function renderPlayers() {
  const searchValue = document.getElementById("searchBox").value.toLowerCase();
  let filtered = players.filter(p => p.name.toLowerCase().includes(searchValue));

  if (currentGamemode === "overall") {
    filtered.forEach(p => p.points = calculatePoints(p));
    filtered.sort((a,b) => b.points - a.points);
  } else {
    filtered.forEach(p => p.points = tierPoints[p.tiers[currentGamemode]] || 0);
    filtered.sort((a,b) => b.points - a.points);
  }

  const container = document.getElementById("playerList");
  container.innerHTML = "";

  if (!filtered.length) {
    container.innerHTML = `<div class="no-results">No players found</div>`;
    return;
  }

  filtered.forEach((p, idx) => {
    const badge = getBadge(calculatePoints(p));
    let gamemodeDisplay = currentGamemode === "overall"
      ? Object.entries(p.tiers).map(([gm, tier]) =>
          `<div class="gamemode-tier-item">
            <span class="gamemode-tier-text">${gm.toUpperCase()}</span>
            <span class="tier ${tier.toLowerCase()}">${tier}</span>
          </div>`
        ).join("")
      : `<span class="tier ${p.tiers[currentGamemode].toLowerCase()}">${p.tiers[currentGamemode]}</span>`;

    const row = document.createElement("div");
    row.className = `player-row ${currentGamemode!=="overall"?"gamemode-view":""}`;
    row.innerHTML = `
      <div class="rank ${idx===0?"gold":idx===1?"silver":idx===2?"bronze":""}">${idx+1}</div>
      <div class="player-info">
        <img class="player-avatar" src="${p.avatar}" alt="${p.name}">
        <div class="player-details">
          <span class="player-name">
          ${p.name}
             <span class="player-region ${String(p.region || "").toLowerCase()}">${p.region}</span>
          </span>
          <span class="player-points">${p.points} pts <span class="points-badge ${badge.class}">${badge.label}</span></span>
        </div>
      </div>
      <div class="gamemode-tiers">${gamemodeDisplay}</div>
    `;
    row.addEventListener("click", () => openPlayerModal(p));

    // ✅ Store player data for context menu
    row.dataset.username = p.name;
    row.dataset.tiers = JSON.stringify(p.tiers);
    row.dataset.points = p.points;

    container.appendChild(row);
  });
}

function openPlayerModal(player) {
  const modal = document.getElementById("playerModal");
  const body = document.getElementById("modalBody");
  const totalPoints = calculatePoints(player);
  const badge = getBadge(totalPoints);

  // Create tier icons mapping
  const gamemodeIcons = {
    crystal: "Crystal.svg",
    sword: "Sword.svg",
    uhc: "Uhc.svg", 
    potion: "Potion.svg",
    nethpot: "Nethpot.svg",
    smp: "Smp.svg",
    axe: "Axe.svg",
    mace: "Mace.svg",
    diasmp: "Diasmp.svg",
    speed: "Speed.svg",
    elytra: "Elytra.svg",
    trident: "Trident.svg",
    cart: "Cart.svg",
    bed: "Bed.svg",
    bow: "Bow.svg",
    creeper: "Creeper.svg",
    debuff: "DeBuff.svg",
    diasurv: "DiaSurv.svg",
    manhunt: "Manhunt.svg",
    ogvanilla: "OgVanilla.svg",
    ltm: "LTM.svg"
  };

  // Define tier hierarchy for sorting (higher tiers first)
  // Retired tiers have same priority as normal tiers
  const tierHierarchy = {
    'HT0': 0, 'LT0': 1, 'RHT0': 0, 'RLT0': 1,
    'HT1': 2, 'LT1': 3, 'RHT1': 2, 'RLT1': 3,
    'HT2': 4, 'LT2': 5, 'RHT2': 4, 'RLT2': 5,
    'HT3': 6, 'LT3': 7, 'RHT3': 6, 'RLT3': 7,
    'HT4': 8, 'LT4': 9, 'RHT4': 8, 'RLT4': 9,
    'HT5': 10, 'LT5': 11, 'RHT5': 10, 'RLT5': 11,
    'HT6': 12, 'LT6': 13, 'RHT6': 12, 'RLT6': 13
  };

  // Sort tiers by hierarchy (highest first)
  const sortedTiers = Object.entries(player.tiers).sort(([,tierA], [,tierB]) => {
    const rankA = tierHierarchy[tierA] ?? 999;
    const rankB = tierHierarchy[tierB] ?? 999;
    return rankA - rankB;
  });

  // Check if region is a valid region code (2-3 letters) or something else
  const validRegions = ['na', 'eu', 'as', 'sa', 'me', 'au', 'af'];
  const isValidRegion = player.region && validRegions.includes(player.region.toLowerCase());
  
  // Get player's rank position (1-based)
  const playerRank = getPlayerRank(player.name);
  let rankClass = "";
  if (playerRank === 1) rankClass = "rank-1-name";
  else if (playerRank === 2) rankClass = "rank-2-name";
  else if (playerRank === 3) rankClass = "rank-3-name";
  
  body.innerHTML = `
    <div class="player-modal-header">
      <img class="player-modal-avatar" src="${player.avatar}" alt="${player.name}">
      <h2 class="player-modal-name">
        <span class="${rankClass}">${player.name}</span>
        ${isValidRegion ? `<span class="player-region ${player.region.toLowerCase()}">${player.region.toUpperCase()}</span>` : ''}
      </h2>
      <div class="player-modal-points">
        ${totalPoints} points
        <span class="points-badge ${badge.class}">${badge.label}</span>
      </div>
    </div>

    <div class="modal-section">
      <h3 class="modal-section-title">Tiers</h3>
      <div class="tier-grid">
        ${sortedTiers.map(([gm, tier]) => {
          const tierClass = tier.toLowerCase();
          const iconSrc = gamemodeIcons[gm] || "Overall.svg";
          
          return `
            <div class="tier-item">
              <div class="tier-icon-container" style="border-color: var(--${tierClass}, #666);">
                <img class="tier-icon" src="${iconSrc}" alt="${gm}" 
                     onerror="this.style.display='none';">
              </div>
              <span class="tier-label tier ${tierClass}">${tier}</span>
              <span style="font-size: 0.7rem; color: #9ca3af;">${gm.toUpperCase()}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  modal.style.display = "flex";
}

function getPlayerRank(playerName) {
  // Create a sorted copy of players for overall ranking
  const sortedPlayers = [...players];
  
  if (currentGamemode === "overall") {
    sortedPlayers.forEach(p => p.points = calculatePoints(p));
    sortedPlayers.sort((a,b) => b.points - a.points);
  } else {
    sortedPlayers.forEach(p => p.points = tierPoints[p.tiers[currentGamemode]] || 0);
    sortedPlayers.sort((a,b) => b.points - a.points);
  }
  
  // Find the player's position (1-based ranking)
  const playerIndex = sortedPlayers.findIndex(p => p.name === playerName);
  return playerIndex !== -1 ? playerIndex + 1 : 0;
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("playerModal").style.display = "none";
});

document.getElementById("tierInfoBtn").addEventListener("click", () => {
  document.getElementById("tierInfoModal").style.display = "flex";
});
document.getElementById("closeTierInfo").addEventListener("click", () => {
  document.getElementById("tierInfoModal").style.display = "none";
});

document.getElementById("searchBox").addEventListener("input", renderPlayers);

document.querySelectorAll(".gamemode-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".gamemode-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentGamemode = tab.dataset.gamemode;
    renderPlayers();
  });
});

loadPlayers();

const pages = ["gamemodePageMain", "gamemodePageSub", "gamemodePageExtra"];
let currentPageIndex = 0;

function showPage(index) {
  pages.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      if (i === index) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    }
  });
  currentPageIndex = index;
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
  currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
  showPage(currentPageIndex);
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
  currentPageIndex = (currentPageIndex + 1) % pages.length;
  showPage(currentPageIndex);
});

showPage(0);

// =======================
// Context Menu
// =======================
const contextMenu = document.getElementById("playerContextMenu");
let contextPlayer = null;

// Show context menu only on player rows
document.querySelector("#playerList").addEventListener("contextmenu", (e) => {
  const row = e.target.closest(".player-row");
  if (row) {
    e.preventDefault();

    // Get player data stored on the row
    contextPlayer = {
      name: row.dataset.username,
      points: row.dataset.points,
      tiers: row.dataset.tiers
    };

    // Update label dynamically
    contextMenu.querySelector(".context-label").innerText = `Profile – ${contextPlayer.name}`;

    // Position the menu
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.display = "block";
  }
});

// Handle clicks in the menu
contextMenu.addEventListener("click", (e) => {
  if (!contextPlayer) return;
  const action = e.target.dataset.action;
  if (action === "username") {
    navigator.clipboard.writeText(contextPlayer.name);
  } else if (action === "tiers") {
    navigator.clipboard.writeText(contextPlayer.tiers);
  } else if (action === "points") {
    navigator.clipboard.writeText(contextPlayer.points);
  }
  contextMenu.style.display = "none";
});

// Hide menu on outside click or Esc
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    contextMenu.style.display = "none";
  }
});
