import Environment from "./game/Environment";
import Game from "./game/Game";
import AudioResource from "./sound/AudioResource";
import Bgm from "./sound/Bgm";
import Logger from "./util/Logger";

window.onload = () => {
    registerPlayKeyEvent();
}

function registerPlayKeyEvent() {
    const playButton = document.getElementById("play");
    if (!playButton) {
        Logger.error("Play button element not found");
        return;
    }

    playButton.addEventListener("click", startGame);
    playButton.addEventListener("touchstart", e => {
        const touchKey = document.getElementById("touchKeyContainer");
        if (touchKey) touchKey.style.visibility = "visible";
        startGame();
        e.preventDefault();
    });
}

function startGame(): void {
    document.getElementById("play")?.remove();

    AudioResource.enableAutoPlay();
    Bgm.enableAutoPlay();

    const screen = createScreen();
    document.getElementById("container")
            ?.appendChild(screen);

    const game = new Game(screen);
    game.start();
}

function createScreen(): HTMLCanvasElement {
    const screen = document.createElement("canvas");
    screen.id = "enterKey";
    screen.className = "content";
    screen.width = Environment.VIEWPORT_WIDTH;
    screen.height = Environment.VIEWPORT_HEIGHT;
    return screen;
}
