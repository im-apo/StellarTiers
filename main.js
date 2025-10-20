if(sessionStorage.redirect){const redirectPath=sessionStorage.redirect;delete sessionStorage.redirect;history.replaceState(null,'',redirectPath)}
if(location.pathname.startsWith('/StellarTiers/rankings')&&!/^\/StellarTiers\/rankings\/(overall|crystal|smp|diasmp|sword|axe|uhc|potion|nethpot|mace|speed|elytra|cart|ogvanilla|nethuhc|nethsword|ltm)?\/?$/.test(location.pathname)){location.replace('/StellarTiers/rankings/overall')}
document.addEventListener("DOMContentLoaded",()=>{const path=location.pathname;const validGamemodes=['overall','crystal','smp','diasmp','sword','axe','uhc','potion','nethpot','mace','speed','elytra','cart','ogvanilla','nethuhc','nethsword','ltm'];const match=path.match(/\/StellarTiers\/rankings\/([^\/]+)/);const gamemode=match?match[1]:null;if(path.startsWith('/StellarTiers/rankings')&&!validGamemodes.includes(gamemode)){history.replaceState(null,'','/StellarTiers/rankings/overall')}
initializeFromURL()});const ASSET_BASE="/StellarTiers/";const fixAssetPath=(path)=>path.startsWith("assets/")?ASSET_BASE+path:path;const tierPoints={RHT0:200,RLT0:100,HT0:200,LT0:100,RHT1:85,RLT1:70,HT1:85,LT1:70,RHT2:50,RLT2:40,HT2:50,LT2:40,RHT3:20,RLT3:15,HT3:20,LT3:15,RHT4:8,RLT4:6,HT4:8,LT4:6,RHT5:4,RLT5:2,HT5:4,LT5:2,RHT6:-10,RLT6:-20,HT6:-10,LT6:-20,};let players=[];let currentGamemode="overall";let currentPage=1;let playersPerPage=50;let isLoadingMore=!1;let displayedPlayers=0;const INITIAL_LOAD=15;const LOAD_MORE_COUNT=10;let filteredPlayers=[];const kitInfo={crystal:{title:"Crystal PvP Kit",description:"Advanced end crystal combat loadout with heavy emphasis on explosive warfare. Features extensive supplies of ender pearls for mobility, chorus fruit for emergency escapes, and respawn anchors for additional explosive options. The multiple diamond and obsidian blocks enable rapid crystal placement and defensive structures. Purple shulker boxes provide portable storage for extended engagements.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Crystal.png"),},smp:{title:"SMP Kit",description:"Standard survival multiplayer combat loadout with balanced resources. Full netherite protection with comprehensive potion support including healing, speed, and combat buffs. Purple shulker box for storage.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Smp.png"),},diasmp:{title:"Diamond SMP Kit",description:"Traditional diamond-tier SMP combat with balanced approach. Full diamond armor with extensive golden apple reserves and varied potions for adaptable fighting.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Diasmp.png"),},sword:{title:"Sword PvP Kit",description:"Pure sword combat minimalist setup focusing on fundamental melee mechanics. Clean inventory allowing focus on combos, strafing, and movement without distraction.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Sword.png"),},axe:{title:"Axe PvP Kit",description:"Axe-focused combat with emphasis on timing and high damage output. Minimal loadout designed for shield-breaking mechanics and cooldown-based attacks.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Axe.png"),},uhc:{title:"UHC Kit",description:"Ultra Hardcore optimized loadout emphasizing careful resource management. Golden apples are critical since natural regeneration is disabled. Balanced combat tools with strategic potion selection.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Uhc.png"),},nethuhc:{title:"Netherite UHC Kit",description:"Ultra Hardcore Netherite optimized loadout emphasizing careful resource management. Golden apples are critical since natural regeneration is disabled. Balanced combat tools with strategic potion selection.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/NethUhc.png"),},potion:{title:"Potion PvP Kit",description:"High-intensity potion warfare loadout with extensive splash potion arsenal. Features multiple types of instant damage, poison, and debuff potions for aggressive play, alongside healing and regeneration options. Golden carrots provide sustained saturation.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Potion.png"),},nethpot:{title:"Netherite Potion Kit",description:"Enhanced potion combat with full netherite protection. Combines the speed of potion PvP with superior armor durability and knockback resistance. Heavy focus on golden apples and fish for sustained healing between potion exchanges.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Nethpot.png"),},nethsword:{title:"Netherite Sword Kit",description:"Pure sword combat (But Netherite!) minimalist setup focusing on fundamental melee mechanics. Clean inventory allowing focus on combos, strafing, and movement without distraction.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly! The Official Neth Sword Tierlist Discord is linked here: https://discord.gg/YF9ScxHvEZ",image:fixAssetPath("assets/kits/NethSword.png"),},mace:{title:"Mace Kit",description:"Vertical combat specialist kit built around the mace's fall damage mechanics introduced in 1.21. Features mace as primary weapon with golden apples for survivability. Potions provide mobility buffs and combat advantages for devastating smash attacks from height.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Mace.png"),},speed:{title:"Speed PvP Kit",description:"High-velocity combat kit dominated by splash potions for sustained speed effects. Minimal equipment to maximize movement speed and agility during combat.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Speed.png"),},elytra:{title:"Elytra Kit",description:"Aerial combat specialist with focus on elytra flight mechanics. Multiple milk buckets for clearing negative effects mid-flight, alongside food, potions, and honey for landing safety.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Elytra.png"),},trident:{title:"Trident Kit",description:"Minimalist trident-focused combat setup emphasizing aquatic mobility and ranged attacks. Clean loadout designed for riptide propulsion and loyalty mechanics with room for tactical flexibility.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Trident.png"),},cart:{title:"Minecart Kit",description:"Minecart-based combat utilizing rails, momentum, and vehicle mechanics for unique movement-based fighting strategies.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Cart.png"),},bed:{title:"Bed Kit",description:"Bedwars-style combat setup with building materials and utility items. Features swords, bows, and tools for rapid base construction and destruction. Includes TNT, beds, and various blocks for tactical gameplay.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Bed.png"),},bow:{title:"Bow Kit",description:"Archery-focused minimalist kit emphasizing ranged superiority. Features multiple bows and arrows for sustained ranged pressure with basic melee backup.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Bow.png"),},creeper:{title:"Creeper Kit",description:"Explosive-themed combat with milk buckets for clearing debuffs and golden apples for survival. Includes tools and materials for tactical positioning around explosion mechanics.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Creeper.png"),},debuff:{title:"Debuff Kit",description:"Status effect warfare specialist with heavy emphasis on negative splash potions. Arsenal designed to weaken opponents while maintaining personal advantages through strategic debuff application.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/DeBuff.png"),},diasurv:{title:"Diamond Survival Kit",description:"Diamond-tier crystal PvP combat with end crystal explosive warfare. Features extensive supplies of ender pearls for mobility, chorus fruit for emergency escapes, and respawn anchors for additional explosive options. Diamond armor provides solid protection while maintaining the core crystal combat mechanics with diamond and obsidian blocks for rapid placement.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/DiaSurv.png"),},manhunt:{title:"Manhunt Kit",description:"Diverse survival combat kit mirroring speedrunning scenarios. Includes crafting materials, tools for rapid resource gathering, and combat essentials for fighting while on the move. Features water buckets, beds for respawn setting, and golden apples for clutch healing.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/Manhunt.png"),},ogvanilla:{title:"OG Vanilla Kit",description:"Classic vanilla Minecraft combat with traditional techniques and straightforward gameplay. Focuses on fundamental combat skills without specialized mechanics or modern additions.\n\nWhen a tier testing queue opens for this kit, be sure to join right away to secure your test spot. LT3 tests and below have a 3-day cooldown, while HT3 and higher come with a 7-day cooldown, so plan accordingly!",image:fixAssetPath("assets/kits/OgVanilla.png"),},};function calculatePeakTier(currentTier,peakTier){if(!peakTier||!currentTier)return null;const tierRank={'HT0':0,'LT0':1,'RHT0':0,'RLT0':1,'HT1':2,'LT1':3,'RHT1':2,'RLT1':3,'HT2':4,'LT2':5,'RHT2':4,'RLT2':5,'HT3':6,'LT3':7,'RHT3':6,'RLT3':7,'HT4':8,'LT4':9,'RHT4':8,'RLT4':9,'HT5':10,'LT5':11,'RHT5':10,'RLT5':11,'HT6':12,'LT6':13,'RHT6':12,'RLT6':13,};const currentRank=tierRank[currentTier]??999;const peakRank=tierRank[peakTier]??999;if(peakRank<currentRank){return{isPeak:!1,peakTier:peakTier,showTooltip:!0}}
return{isPeak:!0,peakTier:currentTier,showTooltip:!1}}
function getGamemodeFromURL(){const path=window.location.pathname;const match=path.match(/\/rankings\/([^\/]+)/);return match?match[1]:'overall'}
function updateURL(gamemode){const newPath=`/StellarTiers/rankings/${gamemode}`;window.history.pushState({gamemode},'',newPath)}
function initializeFromURL(){const gamemodeFromURL=getGamemodeFromURL();const validGamemodes=['overall','crystal','smp','diasmp','sword','axe','uhc','potion','nethpot','mace','speed','elytra','cart','ogvanilla','nethuhc','nethsword','ltm'];if(validGamemodes.includes(gamemodeFromURL)){currentGamemode=gamemodeFromURL}else{updateURL('overall');currentGamemode='overall'}
document.querySelectorAll('.gamemode-tab').forEach(tab=>{if(tab.dataset.gamemode===currentGamemode){tab.classList.add('active')}else{tab.classList.remove('active')}});updateKitInfoButton()}
window.addEventListener('popstate',(event)=>{if(event.state&&event.state.gamemode){currentGamemode=event.state.gamemode}else{currentGamemode=getGamemodeFromURL()}
document.querySelectorAll('.gamemode-tab').forEach(tab=>{if(tab.dataset.gamemode===currentGamemode){tab.classList.add('active')}else{tab.classList.remove('active')}});currentPage=1;updateKitInfoButton();renderPlayers()});function createTierWithTooltip(gamemode,tier,peakTier,iconSrc){const tierClass=tier.toLowerCase();const peakInfo=calculatePeakTier(tier,peakTier);const tooltipContent=peakInfo&&!peakInfo.isPeak?`
        <div class="peak-tier-tooltip">
            <div class="peak-tier-content">
                <span class="peak-tier-label">Peak Tier</span>
                <span class="peak-tier-value">
                    <img src="${iconSrc}" class="peak-icon" alt="${gamemode}" onerror="this.style.display='none';">
                    <span class="tier ${peakTier.toLowerCase()}">${peakTier}</span>
                </span>
            </div>
        </div>
    `:'';return `
        <div class="tier-wrapper">
            <div class="gamemode-tier-item">
                <div class="gamemode-tier-icon-container" style="border-color: var(--${tierClass}, #666);">
                    <img class="gamemode-tier-icon" src="${iconSrc}" alt="${gamemode}" 
                         onerror="this.style.display='none';">
                </div>
                <span class="tier ${tierClass}">${tier}</span>
            </div>
            ${tooltipContent}
        </div>
    `}
function renderTierHistory(player,gamemode){if(!player.tierHistory||!player.tierHistory[gamemode]||player.tierHistory[gamemode].length===0){return'<div class="no-history">No tier history available for this gamemode</div>'}
const history=player.tierHistory[gamemode];const tierColors={'HT1':'#f472b6','LT1':'#ec4899','RHT1':'#f472b6','RLT1':'#ec4899','HT2':'#c084fc','LT2':'#a855f7','RHT2':'#c084fc','RLT2':'#a855f7','HT3':'#93c5fd','LT3':'#60a5fa','RHT3':'#93c5fd','RLT3':'#60a5fa','HT4':'#5eead4','LT4':'#34d399','RHT4':'#5eead4','RLT4':'#34d399','HT5':'#fcd34d','LT5':'#fbbf24','RHT5':'#fcd34d','RLT5':'#fbbf24',};return `
        <div class="chart-container">
            <div class="tier-timeline">
                <div class="timeline-line"></div>
                ${history.map((entry, index) => {
                    const color = tierColors[entry.tier] || '#6b7280';
                    const date = new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    });
                    
                    return `<div class="timeline-point"><div class="timeline-dot" style="border-color: ${color};"
title="${entry.tier} - ${date}${entry.note ? ' (' + entry.note + ')' : ''}"></div><span class="timeline-tier tier ${entry.tier.toLowerCase()}">${entry.tier}</span><span class="timeline-date">${date}</span></div>`;
                }).join('')}
            </div>
        </div>
    `}
function updateKitInfoButton(){const kitInfoBtn=document.getElementById("kitInfoBtn");if(currentGamemode!=="overall"&&kitInfo[currentGamemode]){kitInfoBtn.style.display="flex"}else{kitInfoBtn.style.display="none"}}
let selectedRegions=new Set();let allPlayersRanking=[];let isInitialLoad=!0;async function loadPlayers(){const loadingScreen=document.getElementById("loadingScreen");const loadingSubtext=document.getElementById("loadingSubtext");try{const res=await fetch("https://stellartiersbot.onrender.com/players.json");if(!res.ok){throw new Error("Network response was not ok")}
players=await res.json();if(isInitialLoad){const minLoadTime=750;const startTime=window.loadStartTime||Date.now();const elapsedTime=Date.now()-startTime;const remainingTime=Math.max(0,minLoadTime-elapsedTime);setTimeout(()=>{if(loadingScreen){loadingScreen.classList.add("hidden");setTimeout(()=>{loadingScreen.style.display="none"},500)}
isInitialLoad=!1},remainingTime)}else{if(loadingScreen){loadingScreen.classList.add("hidden");setTimeout(()=>{loadingScreen.style.display="none"},500)}}
renderPlayers()}catch(error){console.error("Failed to load players:",error);if(loadingSubtext){loadingSubtext.textContent="Connection failed. Please check your internet connection.";loadingSubtext.style.color="#ef4444"}
setTimeout(()=>{if(loadingSubtext){loadingSubtext.textContent="Retrying...";loadingSubtext.style.color="#9ca3af"}
loadPlayers()},3000)}}
function calculatePoints(player){let total=0;for(const mode in player.tiers){total+=tierPoints[player.tiers[mode]]||0}
return total}
document.getElementById("copyIpBtn").addEventListener("click",()=>{navigator.clipboard.writeText("fadedmc.net");const popup=document.getElementById("copyPopup");popup.style.display="block";setTimeout(()=>(popup.style.display="none"),2000)});document.getElementById("discordBtn").addEventListener("click",()=>{window.open("https://discord.gg/e39z2S4Edg","_blank")});document.getElementById("stellarTiersBtn").addEventListener("click",()=>{window.location.href="StellarTiers/"});document.getElementById("extiersBtn").addEventListener("click",()=>{window.location.href="https://extiers.com/ranking/overall"});function getBadge(points){if(points>=900)
return{label:"Points Overlord",class:"pointoverlord",};if(points>=300)
return{label:"Legendary",class:"legendary",};if(points>=200)
return{label:"Master",class:"master",};if(points>=100)
return{label:"Expert",class:"expert",};if(points>=50)
return{label:"Advanced",class:"advanced",};if(points>=20)
return{label:"Intermediate",class:"intermediate",};return{label:"Novice",class:"novice",}}
function updateOverallTabAppearance(){const overallTabs=document.querySelectorAll('.gamemode-tab[data-gamemode="overall"]');overallTabs.forEach((tab)=>{if(selectedRegions.size>0){tab.classList.add("filtered");const span=tab.querySelector("span");const regionList=Array.from(selectedRegions).map((r)=>r.toUpperCase()).join(", ");span.textContent=`Overall (${regionList})`}else{tab.classList.remove("filtered");tab.querySelector("span").textContent="Overall"}})}
window.addEventListener("online",()=>{const loadingScreen=document.getElementById("loadingScreen");const loadingSubtext=document.getElementById("loadingSubtext");if(loadingScreen&&loadingSubtext){loadingScreen.style.display="flex";loadingScreen.classList.remove("hidden");loadingSubtext.textContent="Connection restored. Reloading...";loadingSubtext.style.color="#10b981";setTimeout(()=>{loadPlayers()},1000)}});window.addEventListener("offline",()=>{const loadingScreen=document.getElementById("loadingScreen");const loadingSubtext=document.getElementById("loadingSubtext");if(loadingScreen&&loadingSubtext){loadingScreen.style.display="flex";loadingScreen.classList.remove("hidden");loadingSubtext.textContent="No internet connection. Waiting for connection...";loadingSubtext.style.color="#ef4444"}});document.getElementById("refreshBtn").addEventListener("click",async()=>{const btn=document.getElementById("refreshBtn");const originalContent=btn.innerHTML;btn.disabled=!0;btn.style.opacity="0.6";btn.style.cursor="not-allowed";btn.innerHTML=`
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Refreshing...
    `;await loadPlayers();setTimeout(()=>{btn.disabled=!1;btn.style.opacity="1";btn.style.cursor="pointer";btn.innerHTML=originalContent},500)});function updatePaginationControls(totalPages,totalPlayers){const existingPagination=document.getElementById("pagination");if(existingPagination){existingPagination.remove()}
if(totalPages<=1)return;const startRank=(currentPage-1)*playersPerPage+1;const endRank=Math.min(currentPage*playersPerPage,totalPlayers);const pagination=document.createElement("div");pagination.id="pagination";pagination.style.cssText=`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 30px;
    padding: 20px 0;
    border-top: 1px solid rgba(80, 80, 80, 0.3);
  `;const pageInfo=document.createElement("span");pageInfo.style.cssText=`
    color: #9ca3af;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 16px;
  `;pageInfo.textContent=`Showing ${startRank}-${endRank} of ${totalPlayers} players`;const prevBtn=document.createElement("button");prevBtn.textContent="← Previous";prevBtn.disabled=currentPage===1;prevBtn.style.cssText=`
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
  `;if(currentPage>1){prevBtn.addEventListener("mouseover",()=>{prevBtn.style.background="rgba(50, 50, 50, 0.95)";prevBtn.style.borderColor="#aaa"});prevBtn.addEventListener("mouseout",()=>{prevBtn.style.background="rgba(30, 30, 30, 0.95)";prevBtn.style.borderColor="rgba(80, 80, 80, 0.6)"})}
document.getElementById("logoBtn").addEventListener("click",()=>{currentGamemode="overall";updateURL('overall');currentPage=1;currentPageIndex=0;showPage(0);selectedRegions.clear();updateOverallTabAppearance();updateRegionCheckboxes();document.getElementById("searchBox").value="";document.querySelectorAll(".gamemode-tab").forEach((t)=>{if(t.dataset.gamemode==="overall"){t.classList.add("active")}else{t.classList.remove("active")}});renderPlayers()});const nextBtn=document.createElement("button");nextBtn.textContent="Next →";nextBtn.disabled=currentPage===totalPages;nextBtn.style.cssText=`
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
  `;if(currentPage<totalPages){nextBtn.addEventListener("mouseover",()=>{nextBtn.style.background="rgba(50, 50, 50, 0.95)";nextBtn.style.borderColor="#aaa"});nextBtn.addEventListener("mouseout",()=>{nextBtn.style.background="rgba(30, 30, 30, 0.95)";nextBtn.style.borderColor="rgba(80, 80, 80, 0.6)"})}
prevBtn.addEventListener("click",()=>{if(currentPage>1){currentPage--;renderPlayers()}});nextBtn.addEventListener("click",()=>{if(currentPage<totalPages){currentPage++;renderPlayers()}});pagination.appendChild(prevBtn);const pageNumbers=document.createElement("div");pageNumbers.style.cssText=`
    display: flex;
    gap: 6px;
    align-items: center;
  `;let startPage=Math.max(1,currentPage-2);let endPage=Math.min(totalPages,currentPage+2);if(startPage>1){const firstPage=createPageButton(1);pageNumbers.appendChild(firstPage);if(startPage>2){const dots=document.createElement("span");dots.textContent="...";dots.style.color="#666";pageNumbers.appendChild(dots)}}
for(let i=startPage;i<=endPage;i++){pageNumbers.appendChild(createPageButton(i))}
if(endPage<totalPages){if(endPage<totalPages-1){const dots=document.createElement("span");dots.textContent="...";dots.style.color="#666";pageNumbers.appendChild(dots)}
const lastPage=createPageButton(totalPages);pageNumbers.appendChild(lastPage)}
pagination.appendChild(pageNumbers);pagination.appendChild(pageInfo);pagination.appendChild(nextBtn);document.getElementById("playerList").appendChild(pagination)}
function createPageButton(pageNum){const btn=document.createElement("button");btn.textContent=pageNum;btn.style.cssText=`
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
  `;if(pageNum!==currentPage){btn.addEventListener("mouseover",()=>{btn.style.background="rgba(50, 50, 50, 0.95)";btn.style.borderColor="#aaa"});btn.addEventListener("mouseout",()=>{btn.style.background="rgba(30, 30, 30, 0.95)";btn.style.borderColor="rgba(80, 80, 80, 0.6)"})}
btn.addEventListener("click",()=>{currentPage=pageNum;renderPlayers()});return btn}
function renderTierColumns(filteredPlayers,container){const tierGroups={"Tier 1":[],"Tier 2":[],"Tier 3":[],"Tier 4":[],"Tier 5":[],};const tierMapping={HT1:"Tier 1",LT1:"Tier 1",RHT1:"Tier 1",RLT1:"Tier 1",HT2:"Tier 2",LT2:"Tier 2",RHT2:"Tier 2",RLT2:"Tier 2",HT3:"Tier 3",LT3:"Tier 3",RHT3:"Tier 3",RLT3:"Tier 3",HT4:"Tier 4",LT4:"Tier 4",RHT4:"Tier 4",RLT4:"Tier 4",HT5:"Tier 5",LT5:"Tier 5",RHT5:"Tier 5",RLT5:"Tier 5",};const tierIcons={"Tier 1":fixAssetPath("assets/icons/tier_1.svg"),"Tier 2":fixAssetPath("assets/icons/tier_2.svg"),"Tier 3":fixAssetPath("assets/icons/tier_3.svg"),"Tier 4":fixAssetPath("assets/icons/tier_45.svg"),"Tier 5":fixAssetPath("assets/icons/tier_45.svg"),};filteredPlayers.forEach((player)=>{const tierCode=player.tiers&&player.tiers[currentGamemode];const tierGroup=tierMapping[tierCode];if(tierGroup){player.currentTierCode=tierCode;tierGroups[tierGroup].push(player)}});const columnsContainer=document.createElement("div");columnsContainer.className="tier-columns-container";Object.entries(tierGroups).forEach(([tierName,players],index)=>{const column=document.createElement("div");column.className="tier-column";const header=document.createElement("div");header.className=`tier-column-header tier-${index + 1}`;const tierIcon=tierIcons[tierName];if(tierIcon){header.innerHTML=`<img src="${tierIcon}" alt="${tierName}" onerror="this.style.display='none';"> ${tierName}`}else{header.textContent=tierName}
column.appendChild(header);if(!players||players.length===0){const emptyState=document.createElement("div");emptyState.style.cssText=`
                text-align: center;
                padding: 20px;
                color: #64748b;
                font-size: 0.9rem;
                font-style: italic;
            `;emptyState.textContent="No players in this tier";column.appendChild(emptyState)}else{players.forEach((player)=>{const tierCode=player.currentTierCode||"";const isHighTier=/HT/.test(tierCode);const isRetired=/^R/.test(tierCode);const playerDiv=document.createElement("div");playerDiv.classList.add("tier-column-player");if(isHighTier){playerDiv.classList.add("tier-column-player-high")}else{playerDiv.classList.add("tier-column-player-low")}
if(isRetired){playerDiv.classList.add("tier-column-player-retired")}
const tierIndicatorHTML=isRetired?`<img src="${fixAssetPath("assets/icons/retired_icon.svg")}" class="retired-indicator-icon" alt="Retired" onerror="this.style.display='none';">`:"";const htltIndicatorHTML=isHighTier?`<img src="${fixAssetPath("assets/icons/ht_icon.svg")}" class="tier-indicator-icon" alt="HT" onerror="this.style.display='none';">`:`<img src="${fixAssetPath("assets/icons/lt_icon.svg")}" class="tier-indicator-icon" alt="LT" onerror="this.style.display='none';">`;playerDiv.innerHTML=`
                    <img src="${player.avatar}" alt="${
                    player.name
                }" class="player-avatar-small" onerror="this.style.display='none';">
                    <div class="tier-column-player-info">
        <span class="tier-column-player-name ${
            isHighTier ? "high-tier" : "low-tier"
        }">
            ${player.name}
            <span class="player-region ${
                player.region ? player.region.toLowerCase() : "unknown"
            }">
                ${player.region ? player.region.toUpperCase() : "UNKNOWN"}
            </span>
        </span>
    </div>
                    <div class="tier-column-player-icons">
                        ${tierIndicatorHTML}
                        ${htltIndicatorHTML}
                    </div>
                `;playerDiv.addEventListener("click",()=>openPlayerModal(player));column.appendChild(playerDiv)})}
columnsContainer.appendChild(column)});container.innerHTML="";container.appendChild(columnsContainer)}
function renderPlayers(){const searchValue=document.getElementById("searchBox").value.toLowerCase();let filtered=players.filter((p)=>p.name.toLowerCase().includes(searchValue));if(currentGamemode==="ltm"){const container=document.getElementById("playerList");container.innerHTML=`
          				<div id="ltmAnnouncement" class="ltm-announcement">
  <h1>⚒️ Limited-Time Modes are coming soon!</h1>
  <p>
    We're working on implementing LTMs, which will include
    <strong>custom limited-time kits</strong> for future minecraft updates and special servers – however,
    a few other things will take priority :)
  </p>
</div>
        `;return}
if(currentGamemode==="overall"){allPlayersRanking=[...players];allPlayersRanking.forEach((p)=>(p.points=calculatePoints(p)));allPlayersRanking.sort((a,b)=>b.points-a.points);if(selectedRegions.size>0){filtered=filtered.filter((p)=>p.region&&selectedRegions.has(p.region.toLowerCase()))}
filtered.forEach((p)=>(p.points=calculatePoints(p)));filtered.sort((a,b)=>b.points-a.points)}else{filtered.forEach((p)=>(p.points=tierPoints[p.tiers[currentGamemode]]||0));filtered.sort((a,b)=>b.points-a.points)}
const container=document.getElementById("playerList");container.innerHTML="";if(!filtered.length){container.innerHTML=`<div class="no-results">No players found</div>`;return}
if(currentGamemode!=="overall"){renderTierColumns(filtered,container);return}
const totalPlayers=filtered.length;const totalPages=Math.ceil(totalPlayers/playersPerPage);const startIndex=(currentPage-1)*playersPerPage;const endIndex=startIndex+playersPerPage;const playersToShow=filtered.slice(startIndex,endIndex);playersToShow.forEach((p,idx)=>{const badge=getBadge(calculatePoints(p));let displayRank=startIndex+idx+1;if(currentGamemode==="overall"&&selectedRegions.size>0){const trueRank=allPlayersRanking.findIndex((player)=>player.name===p.name)+1;displayRank=trueRank}
const gamemodeIcons={crystal:fixAssetPath("assets/gamemode-icons/Crystal.svg"),sword:fixAssetPath("assets/gamemode-icons/Sword.svg"),uhc:fixAssetPath("assets/gamemode-icons/Uhc.svg"),potion:fixAssetPath("assets/gamemode-icons/Potion.svg"),nethpot:fixAssetPath("assets/gamemode-icons/Nethpot.svg"),nethsword:fixAssetPath("assets/gamemode-icons/NethSword.svg"),smp:fixAssetPath("assets/gamemode-icons/Smp.svg"),axe:fixAssetPath("assets/gamemode-icons/Axe.svg"),mace:fixAssetPath("assets/gamemode-icons/Mace.svg"),diasmp:fixAssetPath("assets/gamemode-icons/Diasmp.svg"),speed:fixAssetPath("assets/gamemode-icons/Speed.svg"),elytra:fixAssetPath("assets/gamemode-icons/Elytra.svg"),trident:fixAssetPath("assets/gamemode-icons/Trident.svg"),cart:fixAssetPath("assets/gamemode-icons/Cart.svg"),bed:fixAssetPath("assets/gamemode-icons/Bed.svg"),bow:fixAssetPath("assets/gamemode-icons/Bow.svg"),creeper:fixAssetPath("assets/gamemode-icons/Creeper.svg"),debuff:fixAssetPath("assets/gamemode-icons/DeBuff.svg"),diasurv:fixAssetPath("assets/gamemode-icons/DiaSurv.svg"),manhunt:fixAssetPath("assets/gamemode-icons/Manhunt.svg"),ogvanilla:fixAssetPath("assets/gamemode-icons/OgVanilla.svg"),nethuhc:fixAssetPath("assets/gamemode-icons/NethUhc.svg"),ltm:fixAssetPath("assets/gamemode-icons/LTM.svg"),};const tierHierarchy={HT0:0,LT0:1,RHT0:0,RLT0:1,HT1:2,LT1:3,RHT1:2,RLT1:3,HT2:4,LT2:5,RHT2:4,RLT2:5,HT3:6,LT3:7,RHT3:6,RLT3:7,HT4:8,LT4:9,RHT4:8,RLT4:9,HT5:10,LT5:11,RHT5:10,RLT5:11,HT6:12,LT6:13,RHT6:12,RLT6:13,};const mainTiers=["crystal","sword","uhc","potion","nethpot","smp","axe","mace","diasmp",];const subTiers=["speed","elytra","cart","ogvanilla",];const limitedTiers=["nethuhc","nethsword","ltm"];let gamemodeDisplay=(()=>{const playerMainTiers=[];const playerSubTiers=[];const playerLimitedTiers=[];mainTiers.forEach((gm)=>{if(p.tiers[gm]){playerMainTiers.push([gm,p.tiers[gm],p.peakTiers?.[gm]])}});subTiers.forEach((gm)=>{if(p.tiers[gm]){playerSubTiers.push([gm,p.tiers[gm],p.peakTiers?.[gm]])}});limitedTiers.forEach((gm)=>{if(p.tiers[gm]){playerLimitedTiers.push([gm,p.tiers[gm],p.peakTiers?.[gm]])}});const sortByTierHierarchy=(a,b)=>{const rankA=tierHierarchy[a[1]]??999;const rankB=tierHierarchy[b[1]]??999;return rankA-rankB};playerMainTiers.sort(sortByTierHierarchy);playerSubTiers.sort(sortByTierHierarchy);playerLimitedTiers.sort(sortByTierHierarchy);const createTierItem=([gm,tier,peakTier])=>{const iconSrc=gamemodeIcons[gm]||'assets/gamemode-icons/Overall.svg';return createTierWithTooltip(gm,tier,peakTier,iconSrc)};let html='';if(playerMainTiers.length>0){html+='<div class="tier-row-wrapper">';html+='<span class="tier-row-label">Main Tiers:</span>';html+='<div class="tier-row">';html+=playerMainTiers.map(createTierItem).join('');html+='</div>';html+='</div>'}
if(playerSubTiers.length>0){html+='<div class="tier-row-wrapper">';html+='<span class="tier-row-label">SubTiers:</span>';html+='<div class="tier-row">';html+=playerSubTiers.map(createTierItem).join('');html+='</div>';html+='</div>'}
if(playerLimitedTiers.length>0){html+='<div class="tier-row-wrapper">';html+='<span class="tier-row-label">Limited Tiers:</span>';html+='<div class="tier-row">';html+=playerLimitedTiers.map(createTierItem).join('');html+='</div>';html+='</div>'}
return html})();const row=document.createElement("div");row.className="player-row";const rankClass=displayRank===1?"gold":displayRank===2?"silver":displayRank===3?"bronze":"";let placementBadge="";let rankStyle="position: relative; z-index: 2;";let badgeContainerStyle="position: relative; display: flex; align-items: center; justify-content: center;";if(displayRank===1){placementBadge=`
    <img src="${fixAssetPath('assets/icons/Placement1.svg')}"
         alt="1st Place"
         style="position: absolute; width: 80px; height: 40px; z-index: 1;
                left: 50%; top: 50%; transform: translate(-50%, -50%);" />
  `}else if(displayRank===2){placementBadge=`
    <img src="${fixAssetPath('assets/icons/Placement2.svg')}"
         alt="2nd Place"
         style="position: absolute; width: 80px; height: 40px; z-index: 1;
                left: 50%; top: 50%; transform: translate(-50%, -50%);" />
  `}else if(displayRank===3){placementBadge=`
    <img src="${fixAssetPath('assets/icons/Placement3.svg')}"
         alt="3rd Place"
         style="position: absolute; width: 80px; height: 40px; z-index: 1;
                left: 50%; top: 50%; transform: translate(-50%, -50%);" />
  `}else{placementBadge=`
    <img src="${fixAssetPath('assets/icons/PlacementOther.svg')}"
         alt="Rank"
         style="position: absolute; width: 80px; height: 40px; z-index: 1;
                left: 50%; top: 50%; transform: translate(-50%, -50%);" />
  `}
row.innerHTML=`
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
      <span class="player-points"><span class="points-number">${p.points} pts</span> <span class="points-badge ${badge.class}">${badge.label}</span></span>
    </div>
  </div>
  <div class="gamemode-tiers">${gamemodeDisplay}</div>
`;row.addEventListener("click",()=>openPlayerModal(p));row.dataset.username=p.name;row.dataset.tiers=JSON.stringify(p.tiers);row.dataset.points=p.points;container.appendChild(row)});updatePaginationControls(totalPages,totalPlayers)}
function openPlayerModal(player){const modal=document.getElementById("playerModal");const body=document.getElementById("modalBody");const totalPoints=calculatePoints(player);const badge=getBadge(totalPoints);const gamemodeIcons={crystal:fixAssetPath("assets/gamemode-icons/Crystal.svg"),sword:fixAssetPath("assets/gamemode-icons/Sword.svg"),uhc:fixAssetPath("assets/gamemode-icons/Uhc.svg"),potion:fixAssetPath("assets/gamemode-icons/Potion.svg"),nethpot:fixAssetPath("assets/gamemode-icons/Nethpot.svg"),nethsword:fixAssetPath("assets/gamemode-icons/NethSword.svg"),smp:fixAssetPath("assets/gamemode-icons/Smp.svg"),axe:fixAssetPath("assets/gamemode-icons/Axe.svg"),mace:fixAssetPath("assets/gamemode-icons/Mace.svg"),diasmp:fixAssetPath("assets/gamemode-icons/Diasmp.svg"),speed:fixAssetPath("assets/gamemode-icons/Speed.svg"),elytra:fixAssetPath("assets/gamemode-icons/Elytra.svg"),trident:fixAssetPath("assets/gamemode-icons/Trident.svg"),cart:fixAssetPath("assets/gamemode-icons/Cart.svg"),bed:fixAssetPath("assets/gamemode-icons/Bed.svg"),bow:fixAssetPath("assets/gamemode-icons/Bow.svg"),creeper:fixAssetPath("assets/gamemode-icons/Creeper.svg"),debuff:fixAssetPath("assets/gamemode-icons/DeBuff.svg"),diasurv:fixAssetPath("assets/gamemode-icons/DiaSurv.svg"),manhunt:fixAssetPath("assets/gamemode-icons/Manhunt.svg"),ogvanilla:fixAssetPath("assets/gamemode-icons/OgVanilla.svg"),ltm:fixAssetPath("assets/gamemode-icons/LTM.svg"),nethuhc:fixAssetPath("assets/gamemode-icons/NethUhc.svg"),};const tierHierarchy={HT0:0,LT0:1,RHT0:0,RLT0:1,HT1:2,LT1:3,RHT1:2,RLT1:3,HT2:4,LT2:5,RHT2:4,RLT2:5,HT3:6,LT3:7,RHT3:6,RLT3:7,HT4:8,LT4:9,RHT4:8,RLT4:9,HT5:10,LT5:11,RHT5:10,RLT5:11,HT6:12,LT6:13,RHT6:12,RLT6:13,};const sortedTiers=Object.entries(player.tiers).sort(([,tierA],[,tierB])=>{const rankA=tierHierarchy[tierA]??999;const rankB=tierHierarchy[tierB]??999;return rankA-rankB});const validRegions=["na","eu","as","sa","me","au","af"];const isValidRegion=player.region&&validRegions.includes(player.region.toLowerCase());const playerRank=getPlayerRank(player.name);let rankClass="";if(playerRank===1)rankClass="rank-1-name";else if(playerRank===2)rankClass="rank-2-name";else if(playerRank===3)rankClass="rank-3-name";body.innerHTML=`
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
		<span class="points-number">${totalPoints} points</span>
		<span class="points-badge ${badge.class}">${badge.label}</span>
	  </div>
    </div>
  `;const nameMcBtn=document.createElement("button");nameMcBtn.className="action-button";nameMcBtn.style.cssText=`
  background: rgba(30, 30, 30, 0.9);
  border: 2px solid rgba(120, 120, 120, 0.6);
  border-radius: 16px;
  padding: 12px 20px;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
`;nameMcBtn.innerHTML=`
  <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
  </svg>
  View on NameMC
`;nameMcBtn.addEventListener("click",()=>{window.open(`https://namemc.com/profile/${player.name}`,"_blank")});nameMcBtn.addEventListener("mouseenter",()=>{nameMcBtn.style.background="#111";nameMcBtn.style.color="#fff";nameMcBtn.style.transform="translateY(-2px)";nameMcBtn.style.boxShadow="0 0 20px rgba(160, 160, 160, 0.7)"});nameMcBtn.addEventListener("mouseleave",()=>{nameMcBtn.style.background="rgba(30, 30, 30, 0.9)";nameMcBtn.style.color="#d1d5db";nameMcBtn.style.transform="translateY(0)";nameMcBtn.style.boxShadow="0 0 15px rgba(50, 50, 50, 0.6)"});const hasHistory=player.tierHistory&&Object.keys(player.tierHistory).some(gm=>player.tierHistory[gm]&&player.tierHistory[gm].length>0);const modalBody=document.getElementById("modalBody");if(hasHistory){const tierHistoryBtn=document.createElement("button");tierHistoryBtn.className="action-button";tierHistoryBtn.style.cssText=`
      background: rgba(30, 30, 30, 0.9);
      border: 2px solid rgba(120, 120, 120, 0.6);
      border-radius: 16px;
      padding: 12px 20px;
      color: #d1d5db;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      margin-top: 12px;
    `;tierHistoryBtn.innerHTML=`
      <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
        <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
      </svg>
      View Tier History
    `;tierHistoryBtn.addEventListener("click",()=>{openTierHistoryModal(player)});document.getElementById("tierHistoryModal").addEventListener("click",(e)=>{if(e.target===document.getElementById("tierHistoryModal")){document.getElementById("tierHistoryModal").style.display="none"}});tierHistoryBtn.addEventListener("mouseenter",()=>{tierHistoryBtn.style.background="#111";tierHistoryBtn.style.color="#fff";tierHistoryBtn.style.transform="translateY(-2px)";tierHistoryBtn.style.boxShadow="0 0 20px rgba(160, 160, 160, 0.7)"});tierHistoryBtn.addEventListener("mouseleave",()=>{tierHistoryBtn.style.background="rgba(30, 30, 30, 0.9)";tierHistoryBtn.style.color="#d1d5db";tierHistoryBtn.style.transform="translateY(0)";tierHistoryBtn.style.boxShadow="0 0 15px rgba(50, 50, 50, 0.6)"});const buttonsContainer=document.createElement("div");buttonsContainer.style.cssText=`
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
            margin: 20px auto;
            width: fit-content;
        `;buttonsContainer.appendChild(nameMcBtn);buttonsContainer.appendChild(tierHistoryBtn);modalBody.appendChild(buttonsContainer)}else{nameMcBtn.style.margin="20px auto";nameMcBtn.style.width="fit-content";modalBody.appendChild(nameMcBtn)}
const tiersSection=document.createElement("div");tiersSection.className="modal-section";tiersSection.style.marginTop="20px";tiersSection.innerHTML=`
    <h3 class="modal-section-title">Tiers</h3>
    <div class="tier-grid">
      ${sortedTiers
          .map(([gm, tier]) => {
              const tierClass = tier.toLowerCase();
              const iconSrc =
                  gamemodeIcons[gm] || fixAssetPath("assets/gamemode-icons/Overall.svg");

              return `<div class="tier-item"><div class="tier-icon-container" style="border-color: var(--${tierClass}, #666);"><img class="tier-icon" src="${iconSrc}" alt="${gm}"
onerror="this.style.display='none';"></div><span class="tier-label tier ${tierClass}" style="text-align: center;">${tier}</span><span style="font-size: 0.7rem; color: #9ca3af; text-align: center;">${gm.toUpperCase()}</span></div>`;
          })
          .join("")}
    </div>
  `;modalBody.appendChild(tiersSection);modal.style.display="flex"}
function getPlayerRank(playerName){const sortedPlayers=[...players];if(currentGamemode==="overall"){sortedPlayers.forEach((p)=>(p.points=calculatePoints(p)));sortedPlayers.sort((a,b)=>b.points-a.points)}else{sortedPlayers.forEach((p)=>(p.points=tierPoints[p.tiers[currentGamemode]]||0));sortedPlayers.sort((a,b)=>b.points-a.points)}
const playerIndex=sortedPlayers.findIndex((p)=>p.name===playerName);return playerIndex!==-1?playerIndex+1:0}
function updateRegionCheckboxes(){const checkboxes=document.querySelectorAll('#regionFilterModal input[type="checkbox"]');checkboxes.forEach((checkbox)=>{checkbox.checked=selectedRegions.has(checkbox.value)})}
document.getElementById("closeModal").addEventListener("click",()=>{document.getElementById("playerModal").style.display="none"});document.getElementById("tierInfoBtn").addEventListener("click",()=>{document.getElementById("tierInfoModal").style.display="flex"});document.getElementById("closeTierInfo").addEventListener("click",()=>{document.getElementById("tierInfoModal").style.display="none"});document.addEventListener("DOMContentLoaded",()=>{const savedPageSize=localStorage.getItem("playersPerPage");if(savedPageSize){playersPerPage=parseInt(savedPageSize);const selector=document.getElementById("pageSizeSelector");if(selector){selector.value=savedPageSize}}});document.addEventListener("DOMContentLoaded",()=>{const selector=document.getElementById("pageSizeSelector");document.addEventListener("keydown",(e)=>{document.addEventListener("keydown",(e)=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();const contextMenu=document.getElementById("playerContextMenu");const regionModal=document.getElementById("regionFilterModal");const playerModal=document.getElementById("playerModal");const tierInfoModal=document.getElementById("tierInfoModal");const kitInfoModal=document.getElementById("kitInfoModal");if(contextMenu&&contextMenu.style.display!=="none"){contextMenu.style.display="none"}
if(kitInfoModal&&kitInfoModal.style.display!=="none"){kitInfoModal.style.display="none"}
if(regionModal&&regionModal.style.display!=="none"){regionModal.style.display="none"}
if(playerModal&&playerModal.style.display!=="none"){playerModal.style.display="none"}
if(tierInfoModal&&tierInfoModal.style.display!=="none"){tierInfoModal.style.display="none"}
return}
if(e.target.tagName!=="INPUT"&&e.target.tagName!=="TEXTAREA"&&!e.target.isContentEditable){if(e.key==="/"){e.preventDefault();const searchBox=document.getElementById("searchBox");if(searchBox){searchBox.focus()}}}})});if(selector){selector.addEventListener("change",(e)=>{playersPerPage=parseInt(e.target.value);localStorage.setItem("playersPerPage",playersPerPage.toString());currentPage=1;renderPlayers()})}});document.getElementById("searchBox").addEventListener("input",(e)=>{if(e.target.value==="/"){e.target.value=""}
currentPage=1;renderPlayers()});document.querySelectorAll(".gamemode-tab").forEach((tab)=>{tab.addEventListener("click",()=>{document.querySelectorAll(".gamemode-tab").forEach((t)=>t.classList.remove("active"));tab.classList.add("active");currentGamemode=tab.dataset.gamemode;updateURL(currentGamemode);currentPage=1;updateKitInfoButton();renderPlayers()})});const pages=["gamemodePageMain","gamemodePageSub","gamemodePageExtra"];let currentPageIndex=0;function showPage(index){pages.forEach((id,i)=>{const el=document.getElementById(id);if(el){if(i===index){el.classList.add("active")}else{el.classList.remove("active")}}});currentPageIndex=index}
document.getElementById("prevPageBtn").addEventListener("click",()=>{currentPageIndex=(currentPageIndex-1+pages.length)%pages.length;showPage(currentPageIndex)});document.getElementById("nextPageBtn").addEventListener("click",()=>{currentPageIndex=(currentPageIndex+1)%pages.length;showPage(currentPageIndex)});showPage(0);const regionModal=document.getElementById("regionFilterModal");document.addEventListener("contextmenu",(e)=>{const overallTab=e.target.closest('.gamemode-tab[data-gamemode="overall"]');if(overallTab&&currentGamemode==="overall"){e.preventDefault();updateRegionCheckboxes();regionModal.style.display="flex"}});document.getElementById("regionFilterModal").addEventListener("change",(e)=>{if(e.target.type==="checkbox"){const region=e.target.value;if(e.target.checked){selectedRegions.add(region)}else{selectedRegions.delete(region)}
const allRegions=["na","eu","as","sa","me","au","af"];if(allRegions.every((r)=>selectedRegions.has(r))){selectedRegions.clear();updateRegionCheckboxes()}
updateOverallTabAppearance();currentPage=1;renderPlayers()}});document.getElementById("regionFilterModal").addEventListener("click",(e)=>{if(e.target===regionModal||e.target.classList.contains("close-region-filter")){regionModal.style.display="none"}});function openTierHistoryModal(player){const modal=document.getElementById("tierHistoryModal");const body=document.getElementById("tierHistoryBody");const gamemodeIcons={crystal:fixAssetPath("assets/gamemode-icons/Crystal.svg"),sword:fixAssetPath("assets/gamemode-icons/Sword.svg"),uhc:fixAssetPath("assets/gamemode-icons/Uhc.svg"),potion:fixAssetPath("assets/gamemode-icons/Potion.svg"),nethpot:fixAssetPath("assets/gamemode-icons/Nethpot.svg"),nethsword:fixAssetPath("assets/gamemode-icons/NethSword.svg"),smp:fixAssetPath("assets/gamemode-icons/Smp.svg"),axe:fixAssetPath("assets/gamemode-icons/Axe.svg"),mace:fixAssetPath("assets/gamemode-icons/Mace.svg"),diasmp:fixAssetPath("assets/gamemode-icons/Diasmp.svg"),speed:fixAssetPath("assets/gamemode-icons/Speed.svg"),elytra:fixAssetPath("assets/gamemode-icons/Elytra.svg"),trident:fixAssetPath("assets/gamemode-icons/Trident.svg"),cart:fixAssetPath("assets/gamemode-icons/Cart.svg"),bed:fixAssetPath("assets/gamemode-icons/Bed.svg"),bow:fixAssetPath("assets/gamemode-icons/Bow.svg"),creeper:fixAssetPath("assets/gamemode-icons/Creeper.svg"),debuff:fixAssetPath("assets/gamemode-icons/DeBuff.svg"),diasurv:fixAssetPath("assets/gamemode-icons/DiaSurv.svg"),manhunt:fixAssetPath("assets/gamemode-icons/Manhunt.svg"),ogvanilla:fixAssetPath("assets/gamemode-icons/OgVanilla.svg"),ltm:fixAssetPath("assets/gamemode-icons/LTM.svg"),nethuhc:fixAssetPath("assets/gamemode-icons/NethUhc.svg"),};const gamesWithHistory=Object.keys(player.tierHistory||{}).filter(gm=>player.tierHistory[gm]&&player.tierHistory[gm].length>0);if(gamesWithHistory.length===0)return;const firstGamemode=gamesWithHistory[0];body.innerHTML=`
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div class="player-modal-header" style="margin-bottom: 32px;">
                <img class="player-modal-avatar" src="${player.avatar}" alt="${player.name}">
                <h2 class="player-modal-name" style="margin-bottom: 8px;">
                    <span>${player.name}</span>
                </h2>
                <div style="font-size: 1.2rem; color: #9ca3af; font-weight: 600;">Tier History</div>
            </div>
            
            <div style="width: 100%; padding: 40px; background: rgba(15, 15, 15, 0.6); border-radius: 20px; border: 1px solid rgba(80, 80, 80, 0.3);">
                <div style="display: flex; justify-content: center; margin-bottom: 40px;">
                    <div class="gamemode-selector" style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
                        ${gamesWithHistory.map(gm => {
                            const iconSrc = gamemodeIcons[gm] || 'assets/gamemode-icons/Overall.svg';
                            return `<button class="gamemode-selector-btn ${gm === firstGamemode ? 'active' : ''}"
data-gamemode="${gm}"
style="background: ${gm === firstGamemode ? 'linear-gradient(135deg, #333, #111)' : 'rgba(30, 30, 30, 0.8)'}; 
                                               border: 2px solid ${gm === firstGamemode ? '#ccc' : 'rgba(80, 80, 80, 0.4)'}; 
                                               border-radius: 16px; 
                                               padding: 16px; 
                                               cursor: pointer; 
                                               transition: all 0.3s ease;
                                               box-shadow: ${gm === firstGamemode ? '0 0 18px rgba(200, 200, 200, 0.7)' : 'none'};"><img src="${iconSrc}" alt="${gm}" style="width: 40px; height: 40px; display: block;" onerror="this.style.display='none';"></button>`;
                        }).join('')}
                    </div>
                </div>
                <div class="tier-history-chart" style="min-height: 320px;">
                    ${renderTierHistory(player, firstGamemode)}
                </div>
            </div>
        </div>
    `;body.querySelectorAll('.gamemode-selector-btn').forEach(btn=>{btn.addEventListener('click',(e)=>{body.querySelectorAll('.gamemode-selector-btn').forEach(b=>{b.classList.remove('active');b.style.background='rgba(30, 30, 30, 0.8)';b.style.borderColor='rgba(80, 80, 80, 0.4)';b.style.boxShadow='none'});btn.classList.add('active');btn.style.background='linear-gradient(135deg, #333, #111)';btn.style.borderColor='#ccc';btn.style.boxShadow='0 0 18px rgba(200, 200, 200, 0.7)';const selectedGamemode=btn.dataset.gamemode;const chart=body.querySelector('.tier-history-chart');chart.innerHTML=renderTierHistory(player,selectedGamemode)});btn.addEventListener('mouseenter',()=>{if(!btn.classList.contains('active')){btn.style.background='rgba(50, 50, 50, 0.9)';btn.style.borderColor='#999'}});btn.addEventListener('mouseleave',()=>{if(!btn.classList.contains('active')){btn.style.background='rgba(30, 30, 30, 0.8)';btn.style.borderColor='rgba(80, 80, 80, 0.4)'}})});modal.style.display="flex"}
document.getElementById("closeTierHistory").addEventListener("click",()=>{document.getElementById("tierHistoryModal").style.display="none"});const contextMenu=document.getElementById("playerContextMenu");let contextPlayer=null;document.querySelector("#playerList").addEventListener("contextmenu",(e)=>{const row=e.target.closest(".player-row");if(row){e.preventDefault();contextPlayer={name:row.dataset.username,points:row.dataset.points,tiers:row.dataset.tiers,};contextMenu.querySelector(".context-label").innerText=`Profile – ${contextPlayer.name}`;contextMenu.style.top=`${e.pageY}px`;contextMenu.style.left=`${e.pageX}px`;contextMenu.style.display="block"}});contextMenu.addEventListener("click",(e)=>{if(!contextPlayer)return;const action=e.target.dataset.action;if(action==="username"){navigator.clipboard.writeText(contextPlayer.name)}else if(action==="tiers"){navigator.clipboard.writeText(contextPlayer.tiers)}else if(action==="points"){navigator.clipboard.writeText(contextPlayer.points)}
contextMenu.style.display="none"});document.addEventListener("click",(e)=>{if(!contextMenu.contains(e.target)&&!regionModal.contains(e.target)){contextMenu.style.display="none"}});let lastScrollTop=0;const navbar=document.getElementById('navbar');const scrollThreshold=30;if(navbar){window.addEventListener('scroll',()=>{let scrollTop=window.pageYOffset||document.documentElement.scrollTop;if(scrollTop>lastScrollTop&&scrollTop>scrollThreshold){navbar.classList.add('hidden')}else{navbar.classList.remove('hidden')}
lastScrollTop=scrollTop<=0?0:scrollTop},!1)}
document.getElementById("kitInfoBtn").addEventListener("click",()=>{const info=kitInfo[currentGamemode];if(info){document.getElementById("kitInfoTitle").textContent=info.title;document.getElementById("kitInfoDesc").textContent=info.description;document.querySelector("#kitInfoImage img").src=info.image;document.getElementById("kitInfoModal").style.display="flex"}});document.getElementById("closeKitInfo").addEventListener("click",()=>{document.getElementById("kitInfoModal").style.display="none"});document.addEventListener("DOMContentLoaded",()=>{window.loadStartTime=Date.now();initializeFromURL();loadPlayers()});console.log(`MIT License

Copyright (c) 2025 ImApo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`);console.log(`-----------------------------------------------------------------------------------
If Website appears to be Down Contact ImApo Immediately
discord: cxnine._ Axis Discord Server: https://discord.gg/e39z2S4Edg
-----------------------------------------------------------------------------------`)
