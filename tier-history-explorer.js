// ============================================================================
// TIER HISTORY EXPLORER - Complete Implementation
// ============================================================================

class TierHistoryExplorer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.modal = null;
        this.isPlaying = false;
        this.currentTimeIndex = 0;
        this.playbackSpeed = 1;
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.selectedPlayer = null;
        this.animationFrame = null;
        
        // Data
        this.timelineData = [];
        this.filteredPlayers = [];
        this.dateRange = { start: null, end: null };
        
        // Visual settings
        this.colors = {
            HT0: '#ff69b4', LT0: '#ff1493', RHT0: '#ff69b4', RLT0: '#ff1493',
            HT1: '#f472b6', LT1: '#ec4899', RHT1: '#f472b6', RLT1: '#ec4899',
            HT2: '#c084fc', LT2: '#a855f7', RHT2: '#c084fc', RLT2: '#a855f7',
            HT3: '#93c5fd', LT3: '#60a5fa', RHT3: '#93c5fd', RLT3: '#60a5fa',
            HT4: '#5eead4', LT4: '#34d399', RHT4: '#5eead4', RLT4: '#34d399',
            HT5: '#fcd34d', LT5: '#fbbf24', RHT5: '#fcd34d', RLT5: '#fbbf24',
            HT6: '#f87171', LT6: '#ef4444', RHT6: '#f87171', RLT6: '#ef4444',
        };
        
        this.tierOrder = ['HT0', 'LT0', 'HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 
                          'HT4', 'LT4', 'HT5', 'LT5', 'HT6', 'LT6'];
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }
    
    initializeElements() {
        this.modal = document.getElementById('tierHistoryExplorerModal');
        this.canvas = document.getElementById('tierHistoryCanvas');
        
        if (!this.canvas || !this.modal) {
            console.error('Tier History Explorer elements not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.prepareData();
    }
    
    setupEventListeners() {
        // Open/Close modal
        document.getElementById('tierHistoryExplorerBtn').addEventListener('click', () => {
            this.open();
        });
        
        document.getElementById('closeTierHistoryExplorer').addEventListener('click', () => {
            this.close();
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
        
        // Play/Pause
        document.getElementById('timelinePlayPause').addEventListener('click', () => {
            this.togglePlayback();
        });
        
        // Timeline slider
        const slider = document.getElementById('timelineSlider');
        slider.addEventListener('input', (e) => {
            this.currentTimeIndex = parseInt(e.target.value);
            this.updateVisualization();
            this.updateStats();
        });
        
        // Speed control
        document.getElementById('timelineSpeed').addEventListener('change', (e) => {
            this.playbackSpeed = parseFloat(e.target.value);
        });
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom(1.2);
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom(0.8);
        });
        
        // Canvas interactions
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Filter controls
        document.getElementById('applyHistoryFilters').addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Export controls
        document.getElementById('exportScreenshot').addEventListener('click', () => {
            this.exportScreenshot();
        });
        
        document.getElementById('exportVideo').addEventListener('click', () => {
            this.exportVideo();
        });
        
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('shareTimeline').addEventListener('click', () => {
            this.shareTimeline();
        });
        
        // Fullscreen toggle
        document.getElementById('tierHistoryFullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // View mode toggle
        document.getElementById('tierHistoryViewMode').addEventListener('click', () => {
            this.toggleViewMode();
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            if (this.modal.classList.contains('active')) {
                this.resizeCanvas();
                this.updateVisualization();
            }
        });
    }
    
    prepareData() {
        // Generate synthetic timeline data from current players
        // In production, this would come from your database
        if (typeof players === 'undefined' || !players.length) {
            console.warn('No players data available');
            return;
        }
        
        // Create timeline from tier history
        this.timelineData = this.generateTimelineFromHistory();
        this.filteredPlayers = [...players];
        
        // Set date range
        if (this.timelineData.length > 0) {
            this.dateRange.start = new Date(this.timelineData[0].date);
            this.dateRange.end = new Date(this.timelineData[this.timelineData.length - 1].date);
        } else {
            // Default range
            this.dateRange.start = new Date('2023-01-01');
            this.dateRange.end = new Date();
        }
        
        // Update timeline labels
        document.getElementById('timelineStartDate').textContent = 
            this.dateRange.start.getFullYear();
        document.getElementById('timelineEndDate').textContent = 
            this.dateRange.end.getFullYear();
        
        // Set slider max
        document.getElementById('timelineSlider').max = this.timelineData.length - 1;
        document.getElementById('timelineSlider').value = this.timelineData.length - 1;
        this.currentTimeIndex = this.timelineData.length - 1;
    }
    
    generateTimelineFromHistory() {
        const timeline = [];
        const dateMap = new Map();
        
        // Collect all tier changes across all players
        players.forEach(player => {
            if (!player.tierHistory) return;
            
            Object.entries(player.tierHistory).forEach(([gamemode, history]) => {
                if (!history || !Array.isArray(history)) return;
                
                history.forEach(entry => {
                    const dateKey = entry.date;
                    if (!dateMap.has(dateKey)) {
                        dateMap.set(dateKey, {
                            date: dateKey,
                            changes: []
                        });
                    }
                    
                    dateMap.get(dateKey).changes.push({
                        player: player.name,
                        gamemode: gamemode,
                        tier: entry.tier,
                        note: entry.note || ''
                    });
                });
            });
        });
        
        // Sort by date
        const sorted = Array.from(dateMap.values()).sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        // If no history data, create synthetic data for current state
        if (sorted.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            return [{
                date: today,
                changes: players.map(p => ({
                    player: p.name,
                    gamemode: 'overall',
                    tier: Object.values(p.tiers || {})[0] || 'LT5',
                    note: 'Current tier'
                }))
            }];
        }
        
        return sorted;
    }
    
    open() {
        this.modal.classList.add('active');
        this.resizeCanvas();
        this.updateVisualization();
        this.updateStats();
    }
    
    close() {
        this.modal.classList.remove('active');
        this.stop();
    }
    
    resizeCanvas() {
        const container = document.getElementById('tierHistoryVisualization');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('timelinePlayPause');
        
        if (this.isPlaying) {
            btn.classList.add('playing');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
                    <path d="M6,4H10V20H6V4M14,4H18V20H14V4Z"/>
                </svg>
            `;
            this.play();
        } else {
            btn.classList.remove('playing');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                </svg>
            `;
            this.stop();
        }
    }
    
    play() {
        const animate = () => {
            if (!this.isPlaying) return;
            
            this.currentTimeIndex += this.playbackSpeed;
            
            if (this.currentTimeIndex >= this.timelineData.length - 1) {
                this.currentTimeIndex = 0; // Loop
            }
            
            document.getElementById('timelineSlider').value = Math.floor(this.currentTimeIndex);
            this.updateVisualization();
            this.updateStats();
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stop() {
        this.isPlaying = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(5, this.zoomLevel));
        document.getElementById('zoomLevel').textContent = Math.round(this.zoomLevel * 100) + '%';
        this.updateVisualization();
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = {
            x: e.offsetX - this.panOffset.x,
            y: e.offsetY - this.panOffset.y
        };
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            this.panOffset.x = e.offsetX - this.dragStart.x;
            this.panOffset.y = e.offsetY - this.dragStart.y;
            this.updateVisualization();
        } else {
            // Show tooltip on hover
            this.updateTooltip(e);
        }
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
    }
    
    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(zoomFactor);
    }
    
    handleCanvasClick(e) {
        // Find clicked player and show details
        const player = this.getPlayerAtPosition(e.offsetX, e.offsetY);
        if (player) {
            this.selectedPlayer = player;
            this.showPlayerDetails(player);
        }
    }
    
    updateVisualization() {
        if (!this.ctx || !this.timelineData.length) return;
        
        const { width, height } = this.canvas;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Get current time data
        const currentData = this.timelineData[Math.floor(this.currentTimeIndex)];
        if (!currentData) return;
        
        // Update current date display
        const date = new Date(currentData.date);
        document.getElementById('timelineCurrentDate').textContent = 
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        // Draw swim lanes
        this.drawSwimLanes(currentData);
    }
    
    drawSwimLanes(data) {
        const { width, height } = this.canvas;
        const laneHeight = height / this.tierOrder.length;
        
        // Draw tier lanes
        this.tierOrder.forEach((tier, index) => {
            const y = index * laneHeight;
            
            // Lane background
            this.ctx.fillStyle = index % 2 === 0 ? 'rgba(139, 92, 246, 0.05)' : 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, y, width, laneHeight);
            
            // Lane border
            this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
            
            // Lane label
            this.ctx.fillStyle = '#9ca3af';
            this.ctx.font = 'bold 14px Inter';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(tier, 10, y + laneHeight / 2);
        });
        
        // Group players by tier
        const playersByTier = new Map();
        this.filteredPlayers.forEach(player => {
            // Get player's tier at current time
            const tierAtTime = this.getPlayerTierAtTime(player, data.date);
            if (tierAtTime) {
                if (!playersByTier.has(tierAtTime)) {
                    playersByTier.set(tierAtTime, []);
                }
                playersByTier.get(tierAtTime).push(player);
            }
        });
        
        // Draw players in their lanes
        playersByTier.forEach((playersInTier, tier) => {
            const tierIndex = this.tierOrder.indexOf(tier);
            if (tierIndex === -1) return;
            
            const y = tierIndex * laneHeight + laneHeight / 2;
            const spacing = Math.min(50, (width - 200) / playersInTier.length);
            
            playersInTier.forEach((player, idx) => {
                const x = 150 + idx * spacing + this.panOffset.x;
                const nodeY = y + this.panOffset.y;
                
                // Draw player node
                const color = this.colors[tier] || '#666';
                const radius = this.selectedPlayer === player ? 8 : 6;
                
                this.ctx.fillStyle = color;
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(x, nodeY, radius * this.zoomLevel, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                
                // Draw player name if zoomed in
                if (this.zoomLevel > 1.5) {
                    this.ctx.fillStyle = '#e5e5e5';
                    this.ctx.font = '10px Inter';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(player.name, x, nodeY + radius + 12);
                }
            });
        });
    }
    
    getPlayerTierAtTime(player, date) {
        // Get the most recent tier before or at the given date
        if (!player.tierHistory) return null;
        
        let latestTier = null;
        let latestDate = null;
        
        Object.entries(player.tierHistory).forEach(([gamemode, history]) => {
            if (!history || !Array.isArray(history)) return;
            
            history.forEach(entry => {
                const entryDate = new Date(entry.date);
                const targetDate = new Date(date);
                
                if (entryDate <= targetDate) {
                    if (!latestDate || entryDate > latestDate) {
                        latestDate = entryDate;
                        latestTier = entry.tier;
                    }
                }
            });
        });
        
        // Fallback to current tier if no history
        if (!latestTier && player.tiers) {
            latestTier = Object.values(player.tiers)[0];
        }
        
        return latestTier;
    }
    
    updateTooltip(e) {
        const player = this.getPlayerAtPosition(e.offsetX, e.offsetY);
        const tooltip = document.getElementById('tierHistoryTooltip');
        
        if (player) {
            const data = this.timelineData[Math.floor(this.currentTimeIndex)];
            const tier = this.getPlayerTierAtTime(player, data.date);
            const points = calculatePoints(player);
            
            tooltip.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 4px;">${player.name}</div>
                <div style="color: ${this.colors[tier]}; font-weight: 600;">Tier: ${tier}</div>
                <div style="color: #9ca3af; font-size: 0.85rem;">Points: ${points}</div>
                <div style="color: #9ca3af; font-size: 0.85rem;">Region: ${player.region || 'Unknown'}</div>
            `;
            
            tooltip.style.left = e.offsetX + 15 + 'px';
            tooltip.style.top = e.offsetY + 15 + 'px';
            tooltip.classList.add('active');
        } else {
            tooltip.classList.remove('active');
        }
    }
    
    getPlayerAtPosition(x, y) {
        // Simple hit detection - in production use spatial indexing
        const data = this.timelineData[Math.floor(this.currentTimeIndex)];
        if (!data) return null;
        
        const { height } = this.canvas;
        const laneHeight = height / this.tierOrder.length;
        
        const adjustedX = x - this.panOffset.x;
        const adjustedY = y - this.panOffset.y;
        
        for (const player of this.filteredPlayers) {
            const tier = this.getPlayerTierAtTime(player, data.date);
            if (!tier) continue;
            
            const tierIndex = this.tierOrder.indexOf(tier);
            if (tierIndex === -1) continue;
            
            const playersByTier = this.filteredPlayers.filter(p => 
                this.getPlayerTierAtTime(p, data.date) === tier
            );
            const idx = playersByTier.indexOf(player);
            
            const spacing = Math.min(50, (this.canvas.width - 200) / playersByTier.length);
            const px = 150 + idx * spacing;
            const py = tierIndex * laneHeight + laneHeight / 2;
            
            const dist = Math.sqrt((adjustedX - px) ** 2 + (adjustedY - py) ** 2);
            if (dist < 10 * this.zoomLevel) {
                return player;
            }
        }
        
        return null;
    }
    
    updateStats() {
        const data = this.timelineData[Math.floor(this.currentTimeIndex)];
        if (!data) return;
        
        // Calculate stats for current time
        const activePlayers = new Set(data.changes.map(c => c.player)).size;
        const promotions = data.changes.filter(c => {
            // Simple promotion detection
            return c.note && c.note.toLowerCase().includes('promot');
        }).length;
        
        const demotions = data.changes.filter(c => {
            return c.note && c.note.toLowerCase().includes('demot');
        }).length;
        
        // Update stat displays
        document.getElementById('statTotalPlayers').textContent = this.filteredPlayers.length;
        document.getElementById('statActivePlayers').textContent = activePlayers;
        document.getElementById('statPromotions').textContent = promotions;
        document.getElementById('statDemotions').textContent = demotions;
        
        // Calculate average tier (simplified)
        const tiers = this.filteredPlayers.map(p => 
            this.getPlayerTierAtTime(p, data.date)
        ).filter(Boolean);
        
        if (tiers.length > 0) {
            const avgIndex = tiers.reduce((sum, tier) => 
                sum + this.tierOrder.indexOf(tier), 0
            ) / tiers.length;
            document.getElementById('statAvgTier').textContent = 
                this.tierOrder[Math.floor(avgIndex)] || '-';
        }
        
        // Find fastest riser (placeholder)
        document.getElementById('statFastestRiser').textContent = 
            data.changes.length > 0 ? data.changes[0].player : '-';
    }
    
    applyFilters() {
        const gamemode = document.getElementById('historyGamemodeFilter').value;
        const region = document.getElementById('historyRegionFilter').value;
        const tierRange = document.getElementById('historyTierFilter').value;
        
        this.filteredPlayers = players.filter(player => {
            // Gamemode filter
            if (gamemode !== 'all' && (!player.tiers || !player.tiers[gamemode])) {
                return false;
            }
            
            // Region filter
            if (region !== 'all' && player.region?.toLowerCase() !== region) {
                return false;
            }
            
            // Tier range filter
            if (tierRange !== 'all') {
                const currentTier = Object.values(player.tiers || {})[0];
                if (!currentTier) return false;
                
                if (tierRange === 'ht' && !currentTier.includes('HT')) return false;
                if (tierRange === 'lt' && !currentTier.includes('LT')) return false;
                if (tierRange.startsWith('t')) {
                    const num = tierRange[1];
                    if (!currentTier.includes(num)) return false;
                }
            }
            
            return true;
        });
        
        this.updateVisualization();
        this.updateStats();
    }
    
    exportScreenshot() {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `tier-history-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataURL;
        link.click();
    }
    
    exportVideo() {
        alert('Video export feature coming soon! This will create a time-lapse animation of the tier changes.');
    }
    
    exportData() {
        const data = {
            dateRange: this.dateRange,
            timeline: this.timelineData,
            players: this.filteredPlayers.map(p => ({
                name: p.name,
                region: p.region,
                tiers: p.tiers,
                points: calculatePoints(p)
            }))
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `tier-history-data-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
    }
    
    shareTimeline() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Timeline link copied to clipboard!');
        });
    }
    
    toggleFullscreen() {
        this.modal.classList.toggle('fullscreen');
        this.resizeCanvas();
        this.updateVisualization();
    }
    
    toggleViewMode() {
        // Future: Switch between different visualization modes
        alert('Additional view modes coming soon!\n\n• Network Graph\n• Stream Chart\n• 3D Terrain\n• Heatmap');
    }
    
    showPlayerDetails(player) {
        // Open player modal with their details
        if (typeof openPlayerModal === 'function') {
            openPlayerModal(player);
        }
    }
}

// Initialize when DOM is ready
let tierHistoryExplorer;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tierHistoryExplorer = new TierHistoryExplorer();
    });
} else {
    tierHistoryExplorer = new TierHistoryExplorer();
}