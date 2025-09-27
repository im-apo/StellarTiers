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

// Multi-region filter functionality
let selectedRegions = new Set(); // Store selected regions
let allPlayersRanking = []; // Store the complete ranking for reference

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

function updateOverallTabAppearance() {
  const overallTabs = document.querySelectorAll('.gamemode-tab[data-gamemode="overall"]');
  
  overallTabs.forEach(tab => {
    if (selectedRegions.size > 0) {
      tab.classList.add('filtered');
      const span = tab.querySelector('span');
      const regionList = Array.from(selectedRegions).map(r => r.toUpperCase()).join(', ');
      span.textContent = `Overall (${regionList})`;
    } else {
      tab.classList.remove('filtered');
      tab.querySelector('span').textContent = 'Overall';
    }
  });
}

function renderPlayers() {
  const searchValue = document.getElementById("searchBox").value.toLowerCase();
  let filtered = players.filter(p => p.name.toLowerCase().includes(searchValue));

  // Calculate points and create complete ranking first (for true rank reference)
  if (currentGamemode === "overall") {
    // Create complete ranking of all players
    allPlayersRanking = [...players];
    allPlayersRanking.forEach(p => p.points = calculatePoints(p));
    allPlayersRanking.sort((a,b) => b.points - a.points);
    
    // Apply region filter if any regions are selected
    if (selectedRegions.size > 0) {
      filtered = filtered.filter(p => 
        p.region && selectedRegions.has(p.region.toLowerCase())
      );
    }
    
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
    
    // Get true overall rank (across all regions) when in overall mode with region filter
    let displayRank = idx + 1;
    if (currentGamemode === "overall" && selectedRegions.size > 0) {
      const trueRank = allPlayersRanking.findIndex(player => player.name === p.name) + 1;
      displayRank = trueRank;
    }
    
    // Create gamemode icons mapping
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
    const tierHierarchy = {
      'HT0': 0, 'LT0': 1, 'RHT0': 0, 'RLT0': 1,
      'HT1': 2, 'LT1': 3, 'RHT1': 2, 'RLT1': 3,
      'HT2': 4, 'LT2': 5, 'RHT2': 4, 'RLT2': 5,
      'HT3': 6, 'LT3': 7, 'RHT3': 6, 'RLT3': 7,
      'HT4': 8, 'LT4': 9, 'RHT4': 8, 'RLT4': 9,
      'HT5': 10, 'LT5': 11, 'RHT5': 10, 'RLT5': 11,
      'HT6': 12, 'LT6': 13, 'RHT6': 12, 'RLT6': 13
    };

    // Define tier organization
    const mainTiers = ['crystal', 'sword', 'uhc', 'potion', 'nethpot', 'smp', 'axe', 'mace', 'diasmp'];
    const subTiers = ['speed', 'elytra', 'trident', 'cart', 'bed', 'bow', 'creeper', 'debuff', 'diasurv', 'manhunt', 'ogvanilla', 'ltm'];

    let gamemodeDisplay = currentGamemode === "overall"
      ? (() => {
          // Separate tiers into main and sub categories
          const playerMainTiers = [];
          const playerSubTiers = [];
          
          // Sort main tiers in order and by tier hierarchy
          mainTiers.forEach(gm => {
            if (p.tiers[gm]) {
              playerMainTiers.push([gm, p.tiers[gm]]);
            }
          });
          
          // Sort sub tiers in order and by tier hierarchy
          subTiers.forEach(gm => {
            if (p.tiers[gm]) {
              playerSubTiers.push([gm, p.tiers[gm]]);
            }
          });
          
          // Sort each array by tier hierarchy
          const sortByTierHierarchy = (a, b) => {
            const rankA = tierHierarchy[a[1]] ?? 999;
            const rankB = tierHierarchy[b[1]] ?? 999;
            return rankA - rankB;
          };
          
          playerMainTiers.sort(sortByTierHierarchy);
          playerSubTiers.sort(sortByTierHierarchy);
          
          const createTierItem = ([gm, tier]) => {
            const iconSrc = gamemodeIcons[gm] || "Overall.svg";
            const tierClass = tier.toLowerCase();
            
            return `<div class="gamemode-tier-item">
              <div class="gamemode-tier-icon-container" style="border-color: var(--${tierClass}, #666);">
                <img class="gamemode-tier-icon" src="${iconSrc}" alt="${gm}" 
                     onerror="this.style.display='none';">
              </div>
              <span class="tier ${tierClass}">${tier}</span>
            </div>`;
          };
          
          let html = '';
          
          if (playerMainTiers.length > 0) {
            html += '<div class="tier-row-wrapper">';
            html += '<span class="tier-row-label">Main Tiers:</span>';
            html += '<div class="tier-row">';
            html += playerMainTiers.map(createTierItem).join('');
            html += '</div>';
            html += '</div>';
          }
          
          if (playerSubTiers.length > 0) {
            html += '<div class="tier-row-wrapper">';
            html += '<span class="tier-row-label">SubTiers:</span>';
            html += '<div class="tier-row">';
            html += playerSubTiers.map(createTierItem).join('');
            html += '</div>';
            html += '</div>';
          }
          
          return html;
        })()
      : `<span class="tier ${p.tiers[currentGamemode].toLowerCase()}">${p.tiers[currentGamemode]}</span>`;

    const row = document.createElement("div");
    row.className = `player-row ${currentGamemode!=="overall"?"gamemode-view":""}`;
    
    // Use true overall rank when region filtering is active
    const rankClass = displayRank === 1 ? "gold" : displayRank === 2 ? "silver" : displayRank === 3 ? "bronze" : "";
    
    row.innerHTML = `
      <div class="rank ${rankClass}">${displayRank}</div>
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

    // Store player data for context menu
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

// Multi-region filter functionality
const regionModal = document.getElementById("regionFilterModal");

// Show region filter modal on right-click of any Overall button
document.addEventListener("contextmenu", (e) => {
  const overallTab = e.target.closest('.gamemode-tab[data-gamemode="overall"]');
  if (overallTab && currentGamemode === "overall") {
    e.preventDefault();
    
    // Update checkboxes to reflect current selection
    updateRegionCheckboxes();
    
    // Position and show modal
    regionModal.style.display = "flex";
  }
});

function updateRegionCheckboxes() {
  const checkboxes = document.querySelectorAll('#regionFilterModal input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectedRegions.has(checkbox.value);
  });
}

// Handle region selection
document.getElementById("regionFilterModal").addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const region = e.target.value;
    
    if (e.target.checked) {
      selectedRegions.add(region);
    } else {
      selectedRegions.delete(region);
    }
    
    // If all regions are selected, clear selection (show all)
    const allRegions = ['na', 'eu', 'as', 'sa', 'me', 'au', 'af'];
    if (allRegions.every(r => selectedRegions.has(r))) {
      selectedRegions.clear();
      updateRegionCheckboxes();
    }
    
    updateOverallTabAppearance();
    renderPlayers();
  }
});

// Close modal when clicking outside or close button
document.getElementById("regionFilterModal").addEventListener("click", (e) => {
  if (e.target === regionModal || e.target.classList.contains("close-region-filter")) {
    regionModal.style.display = "none";
  }
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
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target) && !regionModal.contains(e.target)) {
    contextMenu.style.display = "none";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    contextMenu.style.display = "none";
    regionModal.style.display = "none";
  }
});
