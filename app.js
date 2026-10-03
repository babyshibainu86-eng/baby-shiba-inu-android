document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       TELEGRAM WEB APP
    ========================================= */

    const tg =
        window.Telegram &&
        window.Telegram.WebApp
            ? window.Telegram.WebApp
            : null;

    if (tg) {
        try {
            tg.ready();
            tg.expand();
        } catch (e) {
            console.log("Telegram:", e);
        }
    }

    /* =========================================
       STORAGE
    ========================================= */

    const STORAGE_KEY = "babyShibaMiningGame";

    let game = {
        balance: 0,
        totalMined: 0,
        level: 1,
        xp: 0,
        tapPower: 1,
        mineRate: 1,
        energy: 1000,
        maxEnergy: 1000,
        vipLevel: 0,
        lastDailyReward: 0
    };

    /* =========================================
       VIP DATA
    ========================================= */

    const VIP = {
        0: {
            mining: 0,
            energy: 0
        },
        1: {
            mining: 5,
            energy: 100
        },
        2: {
            mining: 10,
            energy: 200
        },
        3: {
            mining: 15,
            energy: 300
        },
        4: {
            mining: 25,
            energy: 500
        },
        5: {
            mining: 50,
            energy: 1000
        }
    };

    const VIP_PRICES = {
        1: 10000,
        2: 50000,
        3: 150000,
        4: 400000,
        5: 1000000
    };

    /* =========================================
       LOAD GAME
    ========================================= */

    function loadGame() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                game = {
                    ...game,
                    ...parsed
                };
            }
        } catch (e) {
            console.log("Load game error:", e);
        }

        if (!Number.isFinite(game.balance)) {
            game.balance = 0;
        }

        if (!Number.isFinite(game.totalMined)) {
            game.totalMined = 0;
        }

        if (!Number.isFinite(game.level) || game.level < 1) {
            game.level = 1;
        }

        if (!Number.isFinite(game.xp) || game.xp < 0) {
            game.xp = 0;
        }

        if (!Number.isFinite(game.tapPower) || game.tapPower < 1) {
            game.tapPower = 1;
        }

        if (!Number.isFinite(game.mineRate) || game.mineRate < 1) {
            game.mineRate = 1;
        }

        if (!Number.isFinite(game.vipLevel) || game.vipLevel < 0) {
            game.vipLevel = 0;
        }

        if (!Number.isFinite(game.lastDailyReward)) {
            game.lastDailyReward = 0;
        }

        const vip = getVIP();

        game.maxEnergy = 1000 + vip.energy;

        if (!Number.isFinite(game.energy)) {
            game.energy = game.maxEnergy;
        }

        game.energy = Math.min(game.energy, game.maxEnergy);
    }

    /* =========================================
       SAVE GAME
    ========================================= */

    function saveGame() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(game)
            );
        } catch (e) {
            console.log("Save game error:", e);
        }
    }

    /* =========================================
       TELEGRAM USER
    ========================================= */

    function loadTelegramUser() {
        let user = null;

        if (
            tg &&
            tg.initDataUnsafe &&
            tg.initDataUnsafe.user
        ) {
            user = tg.initDataUnsafe.user;
        }

        const playerName = document.getElementById("playerName");
        const playerId = document.getElementById("playerId");

        if (!playerName || !playerId) {
            return;
        }

        if (user) {
            const firstName = user.first_name || "";
            const lastName = user.last_name || "";

            const fullName =
                `${firstName} ${lastName}`.trim();

            playerName.textContent =
                fullName ||
                user.username ||
                "Player";

            playerId.textContent =
                user.id
                    ? `ID: ${user.id}`
                    : "Player ID";
        } else {
            playerName.textContent = "Baby Shiba Player";
            playerId.textContent = "Android Player";
        }
    }

    /* =========================================
       XP / LEVEL
    ========================================= */

    function xpNeeded() {
        return game.level * 100;
    }

    function addXP(amount) {
        game.xp += amount;

        while (game.xp >= xpNeeded()) {
            game.xp -= xpNeeded();
            game.level += 1;

            showToast(
                `🎉 Level Up! Level ${game.level}`
            );
        }
    }

    /* =========================================
       VIP
    ========================================= */

    function getVIP() {
        return VIP[game.vipLevel] || VIP[0];
    }

    function updateVIP() {
        const vip = getVIP();

        game.maxEnergy = 1000 + vip.energy;

        if (game.energy > game.maxEnergy) {
            game.energy = game.maxEnergy;
        }

        const vipLevel =
            document.getElementById("vipLevel");

        const currentVipLevel =
            document.getElementById("currentVipLevel");

        const vipMiningBonus =
            document.getElementById("vipMiningBonus");

        const vipEnergyBonus =
            document.getElementById("vipEnergyBonus");

        if (vipLevel) {
            vipLevel.textContent =
                game.vipLevel;
        }

        if (currentVipLevel) {
            currentVipLevel.textContent =
                game.vipLevel;
        }

        if (vipMiningBonus) {
            vipMiningBonus.textContent =
                `+${vip.mining}%`;
        }

        if (vipEnergyBonus) {
            vipEnergyBonus.textContent =
                `+${vip.energy}`;
        }
    }

    /* =========================================
       NUMBER FORMAT
    ========================================= */

    function formatNumber(value) {
        if (!Number.isFinite(value)) {
            return "0";
        }

        if (Math.abs(value) >= 1000000000) {
            return (
                (value / 1000000000)
                    .toFixed(2)
                    .replace(/\.00$/, "") +
                "B"
            );
        }

        if (Math.abs(value) >= 1000000) {
            return (
                (value / 1000000)
                    .toFixed(2)
                    .replace(/\.00$/, "") +
                "M"
            );
        }

        if (Math.abs(value) >= 1000) {
            return (
                (value / 1000)
                    .toFixed(2)
                    .replace(/\.00$/, "") +
                "K"
            );
        }

        return Math.floor(value).toLocaleString();
    }

    /* =========================================
       UPDATE UI
    ========================================= */

    function updateUI() {
        updateVIP();

        const balance =
            document.getElementById("balance");

        const totalMined =
            document.getElementById("totalMined");

        const levelValue =
            document.getElementById("levelValue");

        const xpValue =
            document.getElementById("xpValue");

        const xpText =
            document.getElementById("xpText");

        const xpFill =
            document.getElementById("xpFill");

        const mineRate =
            document.getElementById("mineRate");

        const tapPower =
            document.getElementById("tapPower");

        const energy =
            document.getElementById("energy");

        const maxEnergy =
            document.getElementById("maxEnergy");

        const energyFill =
            document.getElementById("energyFill");

        if (balance) {
            balance.textContent =
                formatNumber(game.balance);
        }

        if (totalMined) {
            totalMined.textContent =
                formatNumber(game.totalMined);
        }

        if (levelValue) {
            levelValue.textContent =
                game.level;
        }

        if (xpValue) {
            xpValue.textContent =
                Math.floor(game.xp);
        }

        if (xpText) {
            xpText.textContent =
                `${Math.floor(game.xp)} / ${xpNeeded()}`;
        }

        if (xpFill) {
            const xpPercent =
                Math.min(
                    100,
                    (game.xp / xpNeeded()) * 100
                );

            xpFill.style.width =
                `${xpPercent}%`;
        }

        if (mineRate) {
            mineRate.textContent =
                `${game.mineRate}/s`;
        }

        if (tapPower) {
            tapPower.textContent =
                game.tapPower;
        }

        if (energy) {
            energy.textContent =
                Math.floor(game.energy);
        }

        if (maxEnergy) {
            maxEnergy.textContent =
                Math.floor(game.maxEnergy);
        }

        if (energyFill) {
            const energyPercent =
                game.maxEnergy > 0
                    ? (game.energy / game.maxEnergy) * 100
                    : 0;

            energyFill.style.width =
                `${Math.max(
                    0,
                    Math.min(100, energyPercent)
                )}%`;
        }
    }

    /* =========================================
       NAVIGATION
    ========================================= */

    function showPage(pageId) {
        const pages =
            document.querySelectorAll(".game-page");

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        const target =
            document.getElementById(pageId);

        if (target) {
            target.classList.add("active");
        }

        const navItems =
            document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {
            item.classList.remove("active");

            if (
                item.getAttribute("data-page") ===
                pageId
            ) {
                item.classList.add("active");
            }
        });
    }

    /* =========================================
       START GAME
    ========================================= */

    const startGame =
        document.getElementById("startGame");

    if (startGame) {
        startGame.addEventListener(
            "click",
            function () {
                const introPage =
                    document.getElementById("introPage");

                const gameApp =
                    document.getElementById("gameApp");

                if (introPage) {
                    introPage.style.display = "none";
                }

                if (gameApp) {
                    gameApp.style.display = "block";
                }

                try {
                    window.scrollTo(0, 0);
                } catch (e) {}

                updateUI();
            }
        );
    }

    /* =========================================
       MINING / TAP
    ========================================= */

    const shibaButton =
        document.getElementById("shibaButton");

    if (shibaButton) {
        shibaButton.addEventListener(
            "click",
            function () {
                if (game.energy < 1) {
                    showToast(
                        "⚡ Not enough energy"
                    );
                    return;
                }

                const vip = getVIP();

                const bonus =
                    1 + vip.mining / 100;

                const earned =
                    game.tapPower * bonus;

                game.balance += earned;
                game.totalMined += earned;

                game.energy -= 1;

                addXP(1);

                createEffect(earned);

                updateUI();
            }
        );
    }

    /* =========================================
       VISUAL MINING EFFECT
    ========================================= */

    function createEffect(amount) {
        const effects =
            document.getElementById("effects");

        if (!effects) {
            return;
        }

        const effect =
            document.createElement("div");

        effect.className = "coin-effect";

        effect.textContent =
            `+${formatNumber(amount)}`;

        effect.style.left =
            `${40 + Math.random() * 20}%`;

        effect.style.top =
            `${45 + Math.random() * 10}%`;

        effects.appendChild(effect);

        setTimeout(function () {
            effect.remove();
        }, 1000);
    }

    /* =========================================
       ENERGY PACK
    ========================================= */

    const energyPackButton =
        document.getElementById(
            "energyPackButton"
        );

    if (energyPackButton) {
        energyPackButton.addEventListener(
            "click",
            function () {
                const price = 250;

                if (game.balance < price) {
                    showToast(
                        "❌ Not enough BSHIB"
                    );
                    return;
                }

                game.balance -= price;

                game.energy =
                    Math.min(
                        game.maxEnergy,
                        game.energy + 250
                    );

                showToast(
                    "⚡ Energy Pack activated"
                );

                updateUI();
                saveGame();
            }
        );
    }

    /* =========================================
       MINING BOOST
    ========================================= */

    const miningBoostButton =
        document.getElementById(
            "miningBoostButton"
        );

    if (miningBoostButton) {
        miningBoostButton.addEventListener(
            "click",
            function () {
                const price = 500;

                if (game.balance < price) {
                    showToast(
                        "❌ Not enough BSHIB"
                    );
                    return;
                }

                game.balance -= price;

                game.tapPower += 1;

                showToast(
                    `⛏️ Mining Power +1`
                );

                updateUI();
                saveGame();
            }
        );
    }

    /* =========================================
       VIP PURCHASE
    ========================================= */

    const vipButtons =
        document.querySelectorAll(
            ".vip-buy-btn"
        );

    vipButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                const requestedVIP =
                    Number(
                        button.getAttribute(
                            "data-vip"
                        )
                    );

                if (
                    !Number.isFinite(requestedVIP) ||
                    requestedVIP < 1 ||
                    requestedVIP > 5
                ) {
                    return;
                }

                if (
                    requestedVIP <= game.vipLevel
                ) {
                    showToast(
                        "⭐ You already have this VIP level"
                    );
                    return;
                }

                if (
                    requestedVIP !==
                    game.vipLevel + 1
                ) {
                    showToast(
                        "🔒 Upgrade VIP levels in order"
                    );
                    return;
                }

                const price =
                    VIP_PRICES[requestedVIP];

                if (game.balance < price) {
                    showToast(
                        "❌ Not enough BSHIB"
                    );
                    return;
                }

                game.balance -= price;

                game.vipLevel =
                    requestedVIP;

                const vip =
                    getVIP();

                game.maxEnergy =
                    1000 + vip.energy;

                game.energy =
                    Math.min(
                        game.maxEnergy,
                        game.energy + vip.energy
                    );

                showToast(
                    `👑 VIP ${requestedVIP} activated`
                );

                updateUI();
                saveGame();
            }
        );
    });

    /* =========================================
       DAILY VIP REWARD
    ========================================= */

    const vipRewardButton =
        document.getElementById(
            "vipRewardButton"
        );

    if (vipRewardButton) {
        vipRewardButton.addEventListener(
            "click",
            function () {
                const now =
                    Date.now();

                const DAY =
                    24 * 60 * 60 * 1000;

                if (
                    game.lastDailyReward &&
                    now -
                        game.lastDailyReward <
                        DAY
                ) {
                    showToast(
                        "⏳ Daily reward already claimed"
                    );
                    return;
                }

                const reward =
                    100 *
                    (game.vipLevel + 1);

                game.balance += reward;

                game.lastDailyReward =
                    now;

                showToast(
                    `🎁 +${formatNumber(
                        reward
                    )} BSHIB`
                );

                updateUI();
                saveGame();
            }
        );
    }

    /* =========================================
       REFERRAL COPY
    ========================================= */

    const copyReferral =
        document.getElementById(
            "copyReferral"
        );

    const referralCode =
        document.getElementById(
            "referralCode"
        );

    if (
        copyReferral &&
        referralCode
    ) {
        copyReferral.addEventListener(
            "click",
            async function () {
                const text =
                    referralCode.textContent ||
                    "";

                try {
                    await navigator.clipboard.writeText(
                        text
                    );

                    showToast(
                        "📋 Referral code copied"
                    );
                } catch (e) {
                    showToast(
                        "📋 Copy failed"
                    );
                }
            }
        );
    }

    /* =========================================
       INVITE FRIENDS
    ========================================= */

    const inviteFriends =
        document.getElementById(
            "inviteFriends"
        );

    if (inviteFriends) {
        inviteFriends.addEventListener(
            "click",
            function () {
                const code =
                    referralCode
                        ? referralCode.textContent
                        : "";

                const message =
                    `Join Baby Shiba Inu 🐕🔥\n\n` +
                    `Mine BSHIB and build your journey.\n\n` +
                    `Referral: ${code}`;

                const url =
                    `https://t.me/share/url?url=${encodeURIComponent(
                        "https://t.me/shibababycoinbot"
                    )}&text=${encodeURIComponent(
                        message
                    )}`;

                if (
                    tg &&
                    typeof tg.openTelegramLink ===
                        "function"
                ) {
                    try {
                        tg.openTelegramLink(url);
                        return;
                    } catch (e) {}
                }

                try {
                    window.open(
                        url,
                        "_blank"
                    );
                } catch (e) {
                    window.location.href =
                        url;
                }
            }
        );
    }

    /* =========================================
       NAVIGATION EVENTS
    ========================================= */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(function (item) {
        item.addEventListener(
            "click",
            function () {
                const page =
                    item.getAttribute(
                        "data-page"
                    );

                if (page) {
                    showPage(page);
                }
            }
        );
    });

    /* =========================================
       TOAST
    ========================================= */

    function showToast(message) {
        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            showToast.timer
        );

        showToast.timer =
            setTimeout(function () {
                toast.classList.remove(
                    "show"
                );
            }, 2200);
    }

    /* =========================================
       AUTOMATIC MINING
       SAME AS ORIGINAL MINING GAME
    ========================================= */

    setInterval(function () {
        if (game.energy <= 0) {
            return;
        }

        const vip = getVIP();

        const bonus =
            1 + vip.mining / 100;

        const earned =
            game.mineRate * bonus;

        game.balance += earned;

        game.totalMined += earned;

        game.energy =
            Math.max(
                0,
                game.energy - 1
            );

        addXP(1);

        updateUI();
    }, 1000);

    /* =========================================
       ENERGY RECHARGE
       SAME AS ORIGINAL MINING GAME
    ========================================= */

    setInterval(function () {
        if (
            game.energy <
            game.maxEnergy
        ) {
            game.energy =
                Math.min(
                    game.maxEnergy,
                    game.energy + 1
                );

            updateUI();
        }
    }, 3000);

    /* =========================================
       AUTO SAVE
       SAME AS ORIGINAL MINING GAME
    ========================================= */

    setInterval(function () {
        saveGame();
    }, 5000);

    /* =========================================
       INITIALIZE
    ========================================= */

    loadGame();

    loadTelegramUser();

    updateVIP();

    updateUI();
});
