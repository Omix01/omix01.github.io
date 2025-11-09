// dynamic-projects.js
class DynamicProjects {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.projects = [];
        this.cacheKey = "github_repos_cache_v1";
        this.cacheTimestampKey = "github_repos_cache_timestamp";
        this.cacheMaxAge = 5 * 60 * 1000; // 5 minutes cache
        this.alwaysIncludeRepos = ['whatsapp-web.js-my-enhancements'];
        this.excludeRepos = ['Omix01', 'omix01.github.io'];
        this.maxRetries = 3;
        this.isFetching = false;
        this.hasInitialRender = false;
    }

    async fetchProjects(forceRefresh = false) {
        try {
            if (!this.container) {
                console.error("❌ [DynamicProjects] Container element not found for:", this.containerId);
                return;
            }

            // Show loading only on first load, not when using cache
            if (!this.hasInitialRender && !forceRefresh) {
                const cachedData = this.getCachedData();
                if (!cachedData) {
                    this.renderLoading();
                }
            }

            // Use cached data if available and not forcing refresh
            if (!forceRefresh) {
                const cachedData = this.getCachedData();
                if (cachedData) {
                    console.info("💾 Loaded cached projects:", cachedData.length);
                    this.projects = cachedData;
                    this.render();
                    this.hasInitialRender = true;
                    // Refresh in background without blocking
                    this.refreshInBackground();
                    return;
                }
            }

            await this.tryFetchWithRetry();
        } catch (error) {
            console.error("❌ Failed to fetch or render:", error);
            this.renderError("Failed to load projects. Please try again later.");
        }
    }

    getCachedData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            const timestamp = localStorage.getItem(this.cacheTimestampKey);
            
            if (!cached || !timestamp) {
                return null;
            }

            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge > this.cacheMaxAge) {
                console.info("🕒 Cache expired, fetching fresh data");
                return null;
            }

            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            } else {
                console.warn("⚠️ Cache is empty or invalid");
                return null;
            }
        } catch (parseErr) {
            console.error("❌ Cache corrupted:", parseErr);
            this.clearCache();
            return null;
        }
    }

    setCachedData(data) {
        try {
            if (Array.isArray(data) && data.length > 0) {
                localStorage.setItem(this.cacheKey, JSON.stringify(data));
                localStorage.setItem(this.cacheTimestampKey, Date.now().toString());
                console.info(`✅ Successfully cached ${data.length} projects`);
            }
        } catch (err) {
            console.warn("⚠️ Could not save to localStorage:", err);
        }
    }

    clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            localStorage.removeItem(this.cacheTimestampKey);
        } catch (err) {
            console.warn("⚠️ Could not clear cache:", err);
        }
    }

    async tryFetchWithRetry(retry = 0) {
        // Prevent multiple simultaneous fetches
        if (this.isFetching) {
            console.log("⏳ Fetch already in progress, skipping...");
            return;
        }

        this.isFetching = true;

        try {
            console.log(`🔍 Fetch attempt ${retry + 1}/${this.maxRetries}`);
            
            const response = await fetch('https://api.github.com/users/Omix01/repos?sort=updated&per_page=100', {
                headers: { 
                    Accept: 'application/vnd.github.mercy-preview+json',
                }
            });

            if (!response.ok) {
                // Handle rate limiting specifically
                if (response.status === 403 || response.status === 429) {
                    const rateLimitReset = response.headers.get('X-RateLimit-Reset');
                    const retryAfter = response.headers.get('Retry-After');
                    
                    console.warn(`⚠️ Rate limited. Reset: ${rateLimitReset}, Retry-After: ${retryAfter}`);
                    
                    // If we have cached data, use it and show warning
                    const cachedData = this.getCachedData();
                    if (cachedData) {
                        console.info("🔄 Using cached data due to rate limiting");
                        this.projects = cachedData;
                        this.render();
                        this.hasInitialRender = true;
                        this.showRateLimitWarning();
                        return;
                    }
                    
                    throw new Error(`GitHub API rate limited. Status: ${response.status}`);
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const repos = await response.json();

            if (!Array.isArray(repos) || repos.length === 0) {
                throw new Error("Empty repos list returned from GitHub API");
            }

            const filteredRepos = [
                ...repos.filter(repo => this.alwaysIncludeRepos.includes(repo.name)),
                ...repos.filter(repo => this.shouldIncludeRepo(repo) && !this.alwaysIncludeRepos.includes(repo.name))
            ].slice(0, 6);

            if (filteredRepos.length === 0) {
                throw new Error("Filtered repos list is empty");
            }

            const projectsWithDetails = await Promise.all(
                filteredRepos.map(repo => this.getRepoWithDetails(repo))
            );

            // ✅ Only save valid non-empty data
            if (Array.isArray(projectsWithDetails) && projectsWithDetails.length > 0) {
                this.projects = projectsWithDetails;
                this.setCachedData(this.projects);
                console.info(`✅ Successfully fetched and stored ${this.projects.length} projects.`);
                this.render();
                this.hasInitialRender = true;
                this.hideRateLimitWarning();
            } else {
                console.warn("⚠️ Projects data invalid or empty, not caching.");
                throw new Error("Projects data invalid or empty");
            }

        } catch (err) {
            console.error(`❌ Fetch attempt ${retry + 1} failed:`, err);

            // On last retry, try to use cached data as fallback
            if (retry === this.maxRetries - 1) {
                const cachedData = this.getCachedData();
                if (cachedData) {
                    console.info("🔄 Using cached data as fallback after all retries failed");
                    this.projects = cachedData;
                    this.render();
                    this.hasInitialRender = true;
                    this.showErrorWarning("Using cached data - some information may be outdated");
                    return;
                }
            }

            if (retry < this.maxRetries) {
                const delay = 1500 * (retry + 1);
                console.warn(`⚠️ Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
                return this.tryFetchWithRetry(retry + 1);
            }

            // Final fallback - render error
            console.error("❌ All retries failed, no cached data available");
            this.renderError("Unable to load projects. Please check your connection and try again.");
        } finally {
            this.isFetching = false;
        }
    }

    showRateLimitWarning() {
        // Create or update a warning banner
        let warningBanner = document.getElementById('rate-limit-warning');
        if (!warningBanner) {
            warningBanner = document.createElement('div');
            warningBanner.id = 'rate-limit-warning';
            warningBanner.className = 'mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm';
            warningBanner.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>GitHub API rate limit exceeded. Showing cached data.</span>
                </div>
            `;
            this.container.parentNode.insertBefore(warningBanner, this.container);
        }
    }

    showErrorWarning(message) {
        let warningBanner = document.getElementById('error-warning');
        if (!warningBanner) {
            warningBanner = document.createElement('div');
            warningBanner.id = 'error-warning';
            warningBanner.className = 'mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm';
            warningBanner.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>${message}</span>
                </div>
            `;
            this.container.parentNode.insertBefore(warningBanner, this.container);
        }
    }

    hideRateLimitWarning() {
        const warningBanner = document.getElementById('rate-limit-warning');
        if (warningBanner) {
            warningBanner.remove();
        }
    }

    async refreshInBackground() {
        // Non-blocking background refresh to keep data live
        if (!this.isFetching) {
            setTimeout(() => this.tryFetchWithRetry(), 1000);
        }
    }

    async getRepoWithDetails(repo) {
        try {
            const languagesResponse = await fetch(repo.languages_url, {
                headers: { 'Cache-Control': 'max-age=300' }
            });
            
            if (!languagesResponse.ok) {
                throw new Error(`Languages fetch failed: ${languagesResponse.status}`);
            }
            
            const languages = await languagesResponse.json();

            const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
            const languagesWithPercentages = Object.entries(languages)
                .map(([language, bytes]) => ({
                    language,
                    percentage: totalBytes ? ((bytes / totalBytes) * 100).toFixed(1) : 0
                }))
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 2);

            return {
                name: repo.name,
                description: repo.description || 'No description available',
                html_url: this.getRepoUrlWithBranch(repo),
                homepage: repo.homepage,
                languages: languagesWithPercentages,
                topics: repo.topics || [],
                stargazers_count: repo.stargazers_count,
                updated_at: repo.updated_at,
                pushed_at: repo.pushed_at,
                is_fork: repo.fork,
                size: repo.size
            };
        } catch (error) {
            console.warn("Language fetch failed for", repo.name, error);
            return this.mapRepoToProject(repo);
        }
    }

    shouldIncludeRepo(repo) {
        return (!repo.fork && !repo.archived) && !this.excludeRepos.includes(repo.name);
    }

    mapRepoToProject(repo) {
        return {
            name: repo.name,
            description: repo.description || 'No description available',
            html_url: this.getRepoUrlWithBranch(repo),
            homepage: repo.homepage,
            languages: [],
            topics: repo.topics || [],
            stargazers_count: repo.stargazers_count,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            is_fork: repo.fork,
            size: repo.size
        };
    }

    getRepoUrlWithBranch(repo) {
        return repo.name === 'whatsapp-web.js-my-enhancements'
            ? `${repo.html_url}/tree/my-feature`
            : repo.html_url;
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    }

    render() {
        if (!this.container) {
            console.error("❌ Render failed — container not found!");
            return;
        }

        if (!this.projects || this.projects.length === 0) {
            console.error("❌ Render failed — no projects to display.");
            this.renderError("No projects available to display.");
            return;
        }

        try {
            this.container.innerHTML = this.projects.map(p => this.renderProject(p)).join('');
            console.log(`🎨 Rendered ${this.projects.length} projects successfully.`);
        } catch (err) {
            console.error("❌ Error during rendering:", err);
            this.renderError("Error rendering projects.");
        }
    }

    renderProject(project) {
        return `
            <div class="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                <!-- Header -->
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            ${this.getProjectIcon(project)}
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                <a href="${project.html_url}" target="_blank" class="before:absolute before:inset-0">
                                    ${this.formatProjectName(project.name)}
                                </a>
                            </h3>
                            ${project.is_fork ? `
                                <span class="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
                                    Forked
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ${this.getTimeAgo(project.pushed_at)}
                    </div>
                </div>

                <!-- Description -->
                <p class="text-gray-600 mb-4 line-clamp-2">${project.description}</p>

                <!-- Languages -->
                ${project.languages.length > 0 ? `
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex items-center gap-2">
                            <div class="flex gap-1">
                                ${project.languages.map(lang => `
                                    <span class="inline-block h-3 w-3 rounded-full" style="background-color: ${this.getLanguageColor(lang.language)}"></span>
                                `).join('')}
                            </div>
                            <span class="text-sm text-gray-700 font-medium">
                                ${project.languages[0].language}
                            </span>
                            ${project.languages.length > 1 ? `
                                <span class="text-sm text-gray-500">
                                    +${project.languages.length - 1} more
                                </span>
                            ` : ''}
                        </div>
                        <div class="flex-1 max-w-20">
                            <div class="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                <div class="h-full flex">
                                    ${project.languages.map((lang, index) => `
                                        <div class="h-full transition-all duration-300" style="width: ${lang.percentage}%; background-color: ${this.getLanguageColor(lang.language)}"></div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Topics -->
                ${project.topics.length > 0 ? `
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${project.topics.slice(0, 3).map(topic => `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                ${topic}
                            </span>
                        `).join('')}
                        ${project.topics.length > 3 ? `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                                +${project.topics.length - 3}
                            </span>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Footer Stats -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="flex items-center gap-1">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                            </svg>
                            ${project.stargazers_count}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.25 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                            </svg>
                            ${project.size ? Math.round(project.size / 1024) : 0} KB
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        ${project.homepage ? `
                            <a href="${project.homepage}" target="_blank" rel="noreferrer" 
                               class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                Demo
                            </a>
                        ` : ''}
                        <a href="${project.html_url}" target="_blank" rel="noreferrer"
                           class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            ${project.name === 'whatsapp-web.js-my-enhancements' ? 'Branch' : 'Code'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f7df1e',
            'TypeScript': '#3178c6',
            'Python': '#3776ab',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#ed8b00',
            'C++': '#00599c',
            'Go': '#00add8',
            'Rust': '#dea584',
            'PHP': '#777bb4',
            'Ruby': '#cc342d',
            'Swift': '#fa7343',
            'Kotlin': '#7f52ff'
        };
        return colors[language] || '#6c757d';
    }

    getProjectIcon(project) {
        const languageIcons = {
            'JavaScript': 'JS',
            'TypeScript': 'TS', 
            'Python': 'Py',
            'HTML': '</>',
            'CSS': 'CSS',
            'Java': 'Jv',
            'C++': 'C++',
            'Go': 'Go',
            'Rust': 'Rs'
        };

        const mainLanguage = project.languages[0]?.language || 'Code';
        return languageIcons[mainLanguage] || '</>';
    }

    formatProjectName(name) {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace(/\./g, ' ');
    }

    renderError(message = "Unable to load projects") {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="text-center py-12">
                <div class="max-w-md mx-auto">
                    <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">${message}</h3>
                    <p class="text-gray-600 mb-4">Please check your connection and try again.</p>
                    <button onclick="window.dynamicProjects.fetchProjects(true)" 
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    renderLoading() {
        if (!this.container) return;
        
        this.container.innerHTML = Array.from({ length: 3 }, (_, i) => `
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div class="animate-pulse">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div>
                                <div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                <div class="h-3 w-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div class="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div class="h-3 w-full bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 w-2/3 bg-gray-200 rounded mb-4"></div>
                    <div class="h-2 w-24 bg-gray-200 rounded mb-4"></div>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div class="flex gap-4">
                            <div class="h-3 w-12 bg-gray-200 rounded"></div>
                            <div class="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div class="flex gap-2">
                            <div class="h-8 w-16 bg-gray-200 rounded"></div>
                            <div class="h-8 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    init() {
        // Don't show loading if we have cached data - it will flash briefly
        const cachedData = this.getCachedData();
        if (!cachedData) {
            this.renderLoading();
        }
        this.fetchProjects();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dynamicProjects = new DynamicProjects('projects-container');
    window.dynamicProjects.init();
});