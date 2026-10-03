document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // BABY SHIBA INU
    // ANDROID COPY
    // =========================

    let balance = 0;
    let totalMined = 0;
    let energy = 1000;
    let maxEnergy = 1000;

    let level = 1;
    let xp = 0;
    let tapPower = 1;
    let vipLevel = 0;

    let miningRate = 1;

    // -------------------------
    // ELEMENTS
    // -------------------------

    const introPage = document.getElementById("introPage");
    const gameApp = document.getElementById("gameApp");
    const startGame = document.getElementById("startGame");

    const shibaButton = document.getElementById("shibaButton");

    const balanceEl = document.getElementById("balance");
    const totalMinedEl = document.getElementById("totalMined");

    const energyEl = document.getElementById("energy");
    const maxEnergyEl = document.getElementById("maxEnergy");
    const energyFill = document.getElementById("energyFill");

    const levelEl = document.getElementById("levelValue");
    const tapPowerEl = document.getElementById("tapPower");

    const xpValueEl = document.getElementById("xpValue");
    const xpTextEl = document.getElementById("xpText");
    const xpFill = document.getElementById("xpFill");

    const mineRateEl = document.getElementById("mineRate");
    const vipLevelEl = document.getElementById("vipLevel");

    const currentVipLevelEl =
        document.getElementById("currentVipLevel");

    const vipMiningBonusEl =
        document.getElementById("vipMiningBonus");

    const vipEnergyBonusEl =
        document.getElementById("vipEnergyBonus");

    const playerNameEl =
        document.getElementById("playerName");

    const playerIdEl =
        document.getElementById("playerId");

    const toastEl =
        document.getElementById("toast");


    // -------------------------
    // TELEGRAM
    // -------------------------

    let tg = null;

    try {

        if (
            window.Telegram &&
            window.Telegram.WebApp
        ) {

            tg = window.Telegram.WebApp;

            tg.ready();

            if (tg.expand) {
                tg.expand();
            }

            if (
                tg.initDataUnsafe &&
                tg.initDataUnsafe.user
            ) {

                const user =
                    tg.initDataUnsafe.user;

                if (playerNameEl) {

                    playerNameEl.textContent =
                        user.first_name ||
                        user.username ||
                        "Player";

                }

                if (playerIdEl) {

                    playerIdEl.textContent =
                        user.id || "---";

                }

            }

        }

    } catch (error) {

        console.log(
            "Telegram WebApp not available."
        );

    }


    // -------------------------
    // START GAME
    // -------------------------

    function startGameNow() {

        if (introPage) {

            introPage.classList.add("hidden");

        }

        if (gameApp) {

            gameApp.classList.remove("hidden");

        }

        updateScreen();

    }


    if (startGame) {

        startGame.addEventListener(
            "click",
            startGameNow
        );

    }


    // -------------------------
    // MINING
    // -------------------------

    function mine() {

        if (energy <= 0) {

            showToast(
                "⚡ Not enough energy"
            );

            return;

        }

        balance += tapPower;

        totalMined += tapPower;

        energy -= 1;

        xp += tapPower;

        checkLevel();

        updateScreen();

    }


    if (shibaButton) {

        shibaButton.addEventListener(
            "click",
            mine
        );

    }


    // -------------------------
    // LEVEL
    // -------------------------

    function checkLevel() {

        const requiredXP =
            level * 100;

        if (xp >= requiredXP) {

            xp -= requiredXP;

            level++;

            showToast(
                "⭐ Level Up!"
            );

        }

    }


    // -------------------------
    // ENERGY REGEN
    // -------------------------

    setInterval(() => {

        if (energy < maxEnergy) {

            energy++;

            updateScreen();

        }

    }, 1000);


    // -------------------------
    // SCREEN UPDATE
    // -------------------------

    function updateScreen() {

        if (balanceEl) {

            balanceEl.textContent =
                formatNumber(balance);

        }

        if (totalMinedEl) {

            totalMinedEl.textContent =
                formatNumber(totalMined);

        }

        if (energyEl) {

            energyEl.textContent =
                Math.floor(energy);

        }

        if (maxEnergyEl) {

            maxEnergyEl.textContent =
                maxEnergy;

        }

        if (levelEl) {

            levelEl.textContent =
                level;

        }

        if (tapPowerEl) {

            tapPowerEl.textContent =
                tapPower;

        }

        if (xpValueEl) {

            xpValueEl.textContent =
                xp;

        }

        if (mineRateEl) {

            mineRateEl.textContent =
                miningRate;

        }

        if (vipLevelEl) {

            vipLevelEl.textContent =
                vipLevel;

        }

        if (currentVipLevelEl) {

            currentVipLevelEl.textContent =
                "VIP " + vipLevel;

        }

        if (vipMiningBonusEl) {

            vipMiningBonusEl.textContent =
                "+" +
                (vipLevel * 5) +
                "%";

        }

        if (vipEnergyBonusEl) {

            vipEnergyBonusEl.textContent =
                "+" +
                (vipLevel * 100);

        }

        // ENERGY BAR

        if (energyFill) {

            const percent =
                (energy / maxEnergy) * 100;

            energyFill.style.width =
                percent + "%";

        }

        // XP BAR

        if (xpFill) {

            const requiredXP =
                level * 100;

            const percent =
                (xp / requiredXP) * 100;

            xpFill.style.width =
                percent + "%";

        }

        if (xpTextEl) {

            xpTextEl.textContent =
                xp +
                " / " +
                (level * 100);

        }

    }


    // -------------------------
    // NAVIGATION
    // -------------------------

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    const gamePages =
        document.querySelectorAll(
            ".game-page"
        );


    navItems.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const pageId =
                    button.dataset.page;

                navItems.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );

                gamePages.forEach(
                    (page) => {

                        page.classList.remove(
                            "active"
                        );

                    }
                );

                const target =
                    document.getElementById(
                        pageId
                    );

                if (target) {

                    target.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    // -------------------------
    // SHOP
    // -------------------------

    const energyPackButton =
        document.getElementById(
            "energyPackButton"
        );

    if (energyPackButton) {

        energyPackButton.addEventListener(
            "click",
            () => {

                if (balance < 250) {

                    showToast(
                        "❌ Not enough BSHIB"
                    );

                    return;

                }

                balance -= 250;

                energy =
                    Math.min(
                        maxEnergy,
                        energy + 250
                    );

                updateScreen();

                showToast(
                    "⚡ Energy restored"
                );

            }
        );

    }


    const miningBoostButton =
        document.getElementById(
            "miningBoostButton"
        );

    if (miningBoostButton) {

        miningBoostButton.addEventListener(
            "click",
            () => {

                if (balance < 500) {

                    showToast(
                        "❌ Not enough BSHIB"
                    );

                    return;

                }

                balance -= 500;

                tapPower++;

                miningRate =
                    tapPower;

                updateScreen();

                showToast(
                    "🚀 Mining Power upgraded"
                );

            }
        );

    }


    // -------------------------
    // VIP
    // -------------------------

    const vipButtons =
        document.querySelectorAll(
            ".vip-buy-btn"
        );

    vipButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const vip =
                        Number(
                            button.dataset.vip
                        );

                    const prices = {

                        1: 10000,
                        2: 50000,
                        3: 150000,
                        4: 400000,
                        5: 1000000

                    };

                    const price =
                        prices[vip];

                    if (
                        !price ||
                        balance < price
                    ) {

                        showToast(
                            "❌ Not enough BSHIB"
                        );

                        return;

                    }

                    if (
                        vip <= vipLevel
                    ) {

                        showToast(
                            "Already activated"
                        );

                        return;

                    }

                    balance -= price;

                    vipLevel = vip;

                    maxEnergy =
                        1000 +
                        vipLevel * 100;

                    energy =
                        Math.min(
                            energy,
                            maxEnergy
                        );

                    updateScreen();

                    showToast(
                        "👑 VIP " +
                        vip +
                        " activated"
                    );

                }
            );

        }
    );


    // -------------------------
    // DAILY VIP REWARD
    // -------------------------

    const vipRewardButton =
        document.getElementById(
            "vipRewardButton"
        );

    if (vipRewardButton) {

        vipRewardButton.addEventListener(
            "click",
            () => {

                const reward =
                    100 * (vipLevel + 1);

                balance += reward;

                updateScreen();

                showToast(
                    "🎁 +" +
                    reward +
                    " BSHIB"
                );

            }
        );

    }


    // -------------------------
    // REFERRAL
    // -------------------------

    const copyReferral =
        document.getElementById(
            "copyReferral"
        );

    if (copyReferral) {

        copyReferral.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        "BSHIB"
                    );

                    showToast(
                        "📋 Referral copied"
                    );

                } catch (error) {

                    showToast(
                        "Referral: BSHIB"
                    );

                }

            }
        );

    }


    const inviteFriends =
        document.getElementById(
            "inviteFriends"
        );

    if (inviteFriends) {

        inviteFriends.addEventListener(
            "click",
            () => {

                const text =
                    encodeURIComponent(
                        "Join Baby Shiba Inu 🐕 $BSHIB"
                    );

                const url =
                    "https://t.me/share/url?url=&text=" +
                    text;

                window.open(
                    url,
                    "_blank"
                );

            }
        );

    }


    // -------------------------
    // TOAST
    // -------------------------

    function showToast(message) {

        if (!toastEl) return;

        toastEl.textContent =
            message;

        toastEl.classList.add(
            "show"
        );

        setTimeout(() => {

            toastEl.classList.remove(
                "show"
            );

        }, 1800);

    }


    // -------------------------
    // NUMBER FORMAT
    // -------------------------

    function formatNumber(number) {

        return Number(
            number
        ).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

    }


    // -------------------------
    // INITIALIZE
    // -------------------------

    updateScreen();

});
