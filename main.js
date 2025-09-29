const tierPoints = {
  RHT0: 200,
  RLT0: 100,
  HT0: 200,
  LT0: 100,
  RHT1: 85,
  RLT1: 70,
  HT1: 85,
  LT1: 70,
  RHT2: 50,
  RLT2: 40,
  HT2: 50,
  LT2: 40,
  RHT3: 20,
  RLT3: 15,
  HT3: 20,
  LT3: 15,
  RHT4: 8,
  RLT4: 6,
  HT4: 8,
  LT4: 6,
  RHT5: 4,
  RLT5: 2,
  HT5: 4,
  LT5: 2,
  RHT6: -10,
  RLT6: -20,
  HT6: -10,
  LT6: -20,
};

let players = [];
let currentGamemode = "overall";
let currentPage = 1;
let playersPerPage = 50;

// Multi-region filter functionality
let selectedRegions = new Set(); // Store selected regions
let allPlayersRanking = []; // Store the complete ranking for reference

async function loadPlayers() {
  const res = await fetch(
    "https://207a685c-33f7-4709-a247-101f6a05420a-00-nsnc0sy5rpo5.picard.replit.dev/players.json"
  );
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
  setTimeout(() => (popup.style.display = "none"), 2000);
});
document.getElementById("stellarTiersBtn").addEventListener("click", () => {
  window.location.href = "StellarPort.html";
});

function getBadge(points) {
  if (points >= 300) return { label: "Legendary", class: "legendary" };
  if (points >= 200) return { label: "Master", class: "master" };
  if (points >= 100) return { label: "Expert", class: "expert" };
  if (points >= 50) return { label: "Advanced", class: "advanced" };
  if (points >= 20) return { label: "Intermediate", class: "intermediate" };
  return { label: "Novice", class: "novice" };
}

function updateOverallTabAppearance() {
  const overallTabs = document.querySelectorAll(
    '.gamemode-tab[data-gamemode="overall"]'
  );

  overallTabs.forEach((tab) => {
    if (selectedRegions.size > 0) {
      tab.classList.add("filtered");
      const span = tab.querySelector("span");
      const regionList = Array.from(selectedRegions)
        .map((r) => r.toUpperCase())
        .join(", ");
      span.textContent = `Overall (${regionList})`;
    } else {
      tab.classList.remove("filtered");
      tab.querySelector("span").textContent = "Overall";
    }
  });
}

function updatePaginationControls(totalPages, totalPlayers) {
  // Remove existing pagination if it exists
  const existingPagination = document.getElementById("pagination");
  if (existingPagination) {
    existingPagination.remove();
  }

  if (totalPages <= 1) return; // Don't show pagination for single page

  const startRank = (currentPage - 1) * playersPerPage + 1;
  const endRank = Math.min(currentPage * playersPerPage, totalPlayers);

  const pagination = document.createElement("div");
  pagination.id = "pagination";
  pagination.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 30px;
    padding: 20px 0;
    border-top: 1px solid rgba(80, 80, 80, 0.3);
  `;

  const pageInfo = document.createElement("span");
  pageInfo.style.cssText = `
    color: #9ca3af;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 16px;
  `;
  pageInfo.textContent = `Showing ${startRank}-${endRank} of ${totalPlayers} players`;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.style.cssText = `
    background: ${
      currentPage === 1 ? "rgba(60, 60, 60, 0.5)" : "rgba(30, 30, 30, 0.95)"
    };
    border: 2px solid rgba(80, 80, 80, 0.6);
    border-radius: 12px;
    padding: 8px 16px;
    color: ${currentPage === 1 ? "#666" : "#d1d5db"};
    font-weight: 600;
    cursor: ${currentPage === 1 ? "not-allowed" : "pointer"};
    transition: all 0.3s ease;
  `;
  if (currentPage > 1) {
    prevBtn.addEventListener("mouseover", () => {
      prevBtn.style.background = "rgba(50, 50, 50, 0.95)";
      prevBtn.style.borderColor = "#aaa";
    });
    prevBtn.addEventListener("mouseout", () => {
      prevBtn.style.background = "rgba(30, 30, 30, 0.95)";
      prevBtn.style.borderColor = "rgba(80, 80, 80, 0.6)";
    });
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.style.cssText = `
    background: ${
      currentPage === totalPages
        ? "rgba(60, 60, 60, 0.5)"
        : "rgba(30, 30, 30, 0.95)"
    };
    border: 2px solid rgba(80, 80, 80, 0.6);
    border-radius: 12px;
    padding: 8px 16px;
    color: ${currentPage === totalPages ? "#666" : "#d1d5db"};
    font-weight: 600;
    cursor: ${currentPage === totalPages ? "not-allowed" : "pointer"};
    transition: all 0.3s ease;
  `;
  if (currentPage < totalPages) {
    nextBtn.addEventListener("mouseover", () => {
      nextBtn.style.background = "rgba(50, 50, 50, 0.95)";
      nextBtn.style.borderColor = "#aaa";
    });
    nextBtn.addEventListener("mouseout", () => {
      nextBtn.style.background = "rgba(30, 30, 30, 0.95)";
      nextBtn.style.borderColor = "rgba(80, 80, 80, 0.6)";
    });
  }

  // Add click handlers
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPlayers();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPlayers();
    }
  });

  pagination.appendChild(prevBtn);

  // Add page numbers (show max 5 pages around current page)
  const pageNumbers = document.createElement("div");
  pageNumbers.style.cssText = `
    display: flex;
    gap: 6px;
    align-items: center;
  `;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    const firstPage = createPageButton(1);
    pageNumbers.appendChild(firstPage);
    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.color = "#666";
      pageNumbers.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.appendChild(createPageButton(i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.color = "#666";
      pageNumbers.appendChild(dots);
    }
    const lastPage = createPageButton(totalPages);
    pageNumbers.appendChild(lastPage);
  }

  pagination.appendChild(pageNumbers);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);

  document.getElementById("playerList").appendChild(pagination);
}

function createPageButton(pageNum) {
  const btn = document.createElement("button");
  btn.textContent = pageNum;
  btn.style.cssText = `
    background: ${
      pageNum === currentPage
        ? "linear-gradient(135deg, #333, #111)"
        : "rgba(30, 30, 30, 0.95)"
    };
    border: 2px solid ${
      pageNum === currentPage ? "#ccc" : "rgba(80, 80, 80, 0.6)"
    };
    border-radius: 8px;
    padding: 6px 12px;
    color: ${pageNum === currentPage ? "#fff" : "#d1d5db"};
    font-weight: ${pageNum === currentPage ? "700" : "600"};
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 36px;
  `;

  if (pageNum !== currentPage) {
    btn.addEventListener("mouseover", () => {
      btn.style.background = "rgba(50, 50, 50, 0.95)";
      btn.style.borderColor = "#aaa";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.background = "rgba(30, 30, 30, 0.95)";
      btn.style.borderColor = "rgba(80, 80, 80, 0.6)";
    });
  }

  btn.addEventListener("click", () => {
    currentPage = pageNum;
    renderPlayers();
  });

  return btn;
}

function renderPlayers() {
  const searchValue = document.getElementById("searchBox").value.toLowerCase();
  let filtered = players.filter((p) =>
    p.name.toLowerCase().includes(searchValue)
  );

  // Calculate points and create complete ranking first (for true rank reference)
  if (currentGamemode === "overall") {
    // Create complete ranking of all players
    allPlayersRanking = [...players];
    allPlayersRanking.forEach((p) => (p.points = calculatePoints(p)));
    allPlayersRanking.sort((a, b) => b.points - a.points);

    // Apply region filter if any regions are selected
    if (selectedRegions.size > 0) {
      filtered = filtered.filter(
        (p) => p.region && selectedRegions.has(p.region.toLowerCase())
      );
    }

    filtered.forEach((p) => (p.points = calculatePoints(p)));
    filtered.sort((a, b) => b.points - a.points);
  } else {
    filtered.forEach(
      (p) => (p.points = tierPoints[p.tiers[currentGamemode]] || 0)
    );
    filtered.sort((a, b) => b.points - a.points);
  }

  // Calculate pagination
  const totalPlayers = filtered.length;
  const totalPages = Math.ceil(totalPlayers / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const playersToShow = filtered.slice(startIndex, endIndex);

  const container = document.getElementById("playerList");
  container.innerHTML = "";

  if (!filtered.length) {
    container.innerHTML = `<div class="no-results">No players found</div>`;
    updatePaginationControls(0, 0);
    return;
  }

  playersToShow.forEach((p, idx) => {
    const badge = getBadge(calculatePoints(p));

    // Calculate actual rank (not just position on current page)
    let displayRank = startIndex + idx + 1;
    if (currentGamemode === "overall" && selectedRegions.size > 0) {
      const trueRank =
        allPlayersRanking.findIndex((player) => player.name === p.name) + 1;
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
      ltm: "LTM.svg",
    };

    // Define tier hierarchy for sorting (higher tiers first)
    const tierHierarchy = {
      HT0: 0,
      LT0: 1,
      RHT0: 0,
      RLT0: 1,
      HT1: 2,
      LT1: 3,
      RHT1: 2,
      RLT1: 3,
      HT2: 4,
      LT2: 5,
      RHT2: 4,
      RLT2: 5,
      HT3: 6,
      LT3: 7,
      RHT3: 6,
      RLT3: 7,
      HT4: 8,
      LT4: 9,
      RHT4: 8,
      RLT4: 9,
      HT5: 10,
      LT5: 11,
      RHT5: 10,
      RLT5: 11,
      HT6: 12,
      LT6: 13,
      RHT6: 12,
      RLT6: 13,
    };

    // Define tier organization
    const mainTiers = [
      "crystal",
      "sword",
      "uhc",
      "potion",
      "nethpot",
      "smp",
      "axe",
      "mace",
      "diasmp",
    ];
    const subTiers = [
      "speed",
      "elytra",
      "trident",
      "cart",
      "bed",
      "bow",
      "creeper",
      "debuff",
      "diasurv",
      "manhunt",
      "ogvanilla",
      "ltm",
    ];

    let gamemodeDisplay =
      currentGamemode === "overall"
        ? (() => {
            // Separate tiers into main and sub categories
            const playerMainTiers = [];
            const playerSubTiers = [];

            // Sort main tiers in order and by tier hierarchy
            mainTiers.forEach((gm) => {
              if (p.tiers[gm]) {
                playerMainTiers.push([gm, p.tiers[gm]]);
              }
            });

            // Sort sub tiers in order and by tier hierarchy
            subTiers.forEach((gm) => {
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

            let html = "";

            if (playerMainTiers.length > 0) {
              html += '<div class="tier-row-wrapper">';
              html += '<span class="tier-row-label">Main Tiers:</span>';
              html += '<div class="tier-row">';
              html += playerMainTiers.map(createTierItem).join("");
              html += "</div>";
              html += "</div>";
            }

            if (playerSubTiers.length > 0) {
              html += '<div class="tier-row-wrapper">';
              html += '<span class="tier-row-label">SubTiers:</span>';
              html += '<div class="tier-row">';
              html += playerSubTiers.map(createTierItem).join("");
              html += "</div>";
              html += "</div>";
            }

            return html;
          })()
        : `<span class="tier ${p.tiers[currentGamemode].toLowerCase()}">${
            p.tiers[currentGamemode]
          }</span>`;

    const row = document.createElement("div");
    row.className = `player-row ${
      currentGamemode !== "overall" ? "gamemode-view" : ""
    }`;

    // Use true overall rank when region filtering is active
    const rankClass =
      displayRank === 1
        ? "gold"
        : displayRank === 2
        ? "silver"
        : displayRank === 3
        ? "bronze"
        : "";

    let placementBadge = "";
    let rankStyle = "position: relative; z-index: 2;";
    let badgeContainerStyle =
      "position: relative; display: flex; align-items: center; justify-content: center;";

    if (displayRank === 1) {
      placementBadge =
        '<img src="Placement1.svg" alt="1st Place" style="position: absolute; width: 80px; height: 40px; z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%);" />';
    } else if (displayRank === 2) {
      placementBadge =
        '<img src="Placement2.svg" alt="2nd Place" style="position: absolute; width: 80px; height: 40px; z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%);" />';
    } else if (displayRank === 3) {
      placementBadge =
        '<img src="Placement3.svg" alt="3rd Place" style="position: absolute; width: 80px; height: 40px; z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%);" />';
    } else {
      placementBadge =
        '<img src="PlacementOther.svg" alt="Rank" style="position: absolute; width: 80px; height: 40px; z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%);" />';
    }

    row.innerHTML = `
  <div class="rank ${rankClass}" style="${badgeContainerStyle}">
    ${placementBadge}
    <span style="${rankStyle}">${displayRank}</span>
  </div>
  <div class="player-info">
    <img class="player-avatar" src="${p.avatar}" alt="${p.name}">
    <div class="player-details">
      <span class="player-name">
      ${p.name}
         <span class="player-region ${String(p.region || "").toLowerCase()}">${
      p.region
    }</span>
      </span>
      <span class="player-points">${p.points} pts <span class="points-badge ${
      badge.class
    }">${badge.label}</span></span>
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

  updatePaginationControls(totalPages, totalPlayers);
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
    ltm: "LTM.svg",
  };

  // Define tier hierarchy for sorting (higher tiers first)
  // Retired tiers have same priority as normal tiers
  const tierHierarchy = {
    HT0: 0,
    LT0: 1,
    RHT0: 0,
    RLT0: 1,
    HT1: 2,
    LT1: 3,
    RHT1: 2,
    RLT1: 3,
    HT2: 4,
    LT2: 5,
    RHT2: 4,
    RLT2: 5,
    HT3: 6,
    LT3: 7,
    RHT3: 6,
    RLT3: 7,
    HT4: 8,
    LT4: 9,
    RHT4: 8,
    RLT4: 9,
    HT5: 10,
    LT5: 11,
    RHT5: 10,
    RLT5: 11,
    HT6: 12,
    LT6: 13,
    RHT6: 12,
    RLT6: 13,
  };

  // Sort tiers by hierarchy (highest first)
  const sortedTiers = Object.entries(player.tiers).sort(
    ([, tierA], [, tierB]) => {
      const rankA = tierHierarchy[tierA] ?? 999;
      const rankB = tierHierarchy[tierB] ?? 999;
      return rankA - rankB;
    }
  );

  // Check if region is a valid region code (2-3 letters) or something else
  const validRegions = ["na", "eu", "as", "sa", "me", "au", "af"];
  const isValidRegion =
    player.region && validRegions.includes(player.region.toLowerCase());

  // Get player's rank position (1-based)
  const playerRank = getPlayerRank(player.name);
  let rankClass = "";
  if (playerRank === 1) rankClass = "rank-1-name";
  else if (playerRank === 2) rankClass = "rank-2-name";
  else if (playerRank === 3) rankClass = "rank-3-name";

  body.innerHTML = `
    <div class="player-modal-header">
      <img class="player-modal-avatar" src="${player.avatar}" alt="${
    player.name
  }">
      <h2 class="player-modal-name">
        <span class="${rankClass}">${player.name}</span>
        ${
          isValidRegion
            ? `<span class="player-region ${player.region.toLowerCase()}">${player.region.toUpperCase()}</span>`
            : ""
        }
      </h2>
      <div class="player-modal-points">
        ${totalPoints} points
        <span class="points-badge ${badge.class}">${badge.label}</span>
      </div>
    </div>
  `;
  
  const nameMcBtn = document.createElement("button");
  nameMcBtn.className = "action-button";
  nameMcBtn.style.cssText = `
  background: rgba(30, 30, 30, 0.9);
  border: 2px solid rgba(120, 120, 120, 0.6);
  border-radius: 16px;
  padding: 12px 20px;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  width: fit-content;
`;
  nameMcBtn.innerHTML = `
  <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
  </svg>
  View on NameMC
`;
  nameMcBtn.addEventListener("click", () => {
    window.open(`https://namemc.com/profile/${player.name}`, "_blank");
  });
  nameMcBtn.addEventListener("mouseenter", () => {
    nameMcBtn.style.background = "#111";
    nameMcBtn.style.color = "#fff";
    nameMcBtn.style.transform = "translateY(-2px)";
    nameMcBtn.style.boxShadow = "0 0 20px rgba(160, 160, 160, 0.7)";
  });
  nameMcBtn.addEventListener("mouseleave", () => {
    nameMcBtn.style.background = "rgba(30, 30, 30, 0.9)";
    nameMcBtn.style.color = "#d1d5db";
    nameMcBtn.style.transform = "translateY(0)";
    nameMcBtn.style.boxShadow = "0 0 15px rgba(50, 50, 50, 0.6)";
  });

  // Insert button after the header section
  const modalBody = document.getElementById("modalBody");
  modalBody.appendChild(nameMcBtn);

  // Add tiers section after button
  const tiersSection = document.createElement("div");
  tiersSection.className = "modal-section";
  tiersSection.style.marginTop = "20px";
  tiersSection.innerHTML = `
    <h3 class="modal-section-title">Tiers</h3>
    <div class="tier-grid">
      ${sortedTiers
        .map(([gm, tier]) => {
          const tierClass = tier.toLowerCase();
          const iconSrc = gamemodeIcons[gm] || "Overall.svg";

          return `
          <div class="tier-item">
            <div class="tier-icon-container" style="border-color: var(--${tierClass}, #666);">
              <img class="tier-icon" src="${iconSrc}" alt="${gm}" 
                   onerror="this.style.display='none';">
            </div>
            <span class="tier-label tier ${tierClass}" style="text-align: center;">${tier}</span>
            <span style="font-size: 0.7rem; color: #9ca3af; text-align: center;">${gm.toUpperCase()}</span>
          </div>
        `;
        })
        .join("")}
    </div>
  `;

  modalBody.appendChild(tiersSection);

  modal.style.display = "flex";
}

function getPlayerRank(playerName) {
  // Create a sorted copy of players for overall ranking
  const sortedPlayers = [...players];

  if (currentGamemode === "overall") {
    sortedPlayers.forEach((p) => (p.points = calculatePoints(p)));
    sortedPlayers.sort((a, b) => b.points - a.points);
  } else {
    sortedPlayers.forEach(
      (p) => (p.points = tierPoints[p.tiers[currentGamemode]] || 0)
    );
    sortedPlayers.sort((a, b) => b.points - a.points);
  }

  // Find the player's position (1-based ranking)
  const playerIndex = sortedPlayers.findIndex((p) => p.name === playerName);
  return playerIndex !== -1 ? playerIndex + 1 : 0;
}

function updateRegionCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '#regionFilterModal input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectedRegions.has(checkbox.value);
  });
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

// Page size selector
document.addEventListener("DOMContentLoaded", () => {
  const savedPageSize = localStorage.getItem("playersPerPage");
  if (savedPageSize) {
    playersPerPage = parseInt(savedPageSize);
    const selector = document.getElementById("pageSizeSelector");
    if (selector) {
      selector.value = savedPageSize;
    }
  }
});

// Event listener for page size selector
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("pageSizeSelector");
  document.addEventListener("keydown", (e) => {
    // Handle Escape key
    document.addEventListener("keydown", (e) => {
      // Handle Escape key
      if (e.key === "Escape") {
        e.preventDefault(); // Stop the event from bubbling
        e.stopPropagation(); // Additional stop

        const contextMenu = document.getElementById("playerContextMenu");
        const regionModal = document.getElementById("regionFilterModal");
        const playerModal = document.getElementById("playerModal"); // Add this too
        const tierInfoModal = document.getElementById("tierInfoModal"); // Add this too

        // Hide all modals
        if (contextMenu && contextMenu.style.display !== "none") {
          contextMenu.style.display = "none";
        }
        if (regionModal && regionModal.style.display !== "none") {
          regionModal.style.display = "none";
        }
        if (playerModal && playerModal.style.display !== "none") {
          playerModal.style.display = "none";
        }
        if (tierInfoModal && tierInfoModal.style.display !== "none") {
          tierInfoModal.style.display = "none";
        }
        return; // Exit early after handling escape
      }

      // Handle "/" key for search focus
      if (
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        !e.target.isContentEditable
      ) {
        if (e.key === "/") {
          e.preventDefault();
          const searchBox = document.getElementById("searchBox");
          if (searchBox) {
            searchBox.focus();
          }
        }
      }
    });
  });
  if (selector) {
    selector.addEventListener("change", (e) => {
      playersPerPage = parseInt(e.target.value);
      localStorage.setItem("playersPerPage", playersPerPage.toString());
      currentPage = 1;
      renderPlayers();
    });
  }
});

// Clear the "/" from the search box if it gets typed
document.getElementById("searchBox").addEventListener("input", (e) => {
  if (e.target.value === "/") {
    e.target.value = "";
  }
  currentPage = 1;
  renderPlayers();
});

document.querySelectorAll(".gamemode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".gamemode-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentGamemode = tab.dataset.gamemode;
    currentPage = 1;
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
    const allRegions = ["na", "eu", "as", "sa", "me", "au", "af"];
    if (allRegions.every((r) => selectedRegions.has(r))) {
      selectedRegions.clear();
      updateRegionCheckboxes();
    }

    updateOverallTabAppearance();
    currentPage = 1;
    renderPlayers();
  }
});

// Close modal when clicking outside or close button
document.getElementById("regionFilterModal").addEventListener("click", (e) => {
  if (
    e.target === regionModal ||
    e.target.classList.contains("close-region-filter")
  ) {
    regionModal.style.display = "none";
  }
});

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
      tiers: row.dataset.tiers,
    };

    // Update label dynamically
    contextMenu.querySelector(
      ".context-label"
    ).innerText = `Profile – ${contextPlayer.name}`;

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
