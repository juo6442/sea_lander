import Environment from "./game/Environment";
import Game from "./game/Game";
import AudioResource from "./sound/AudioResource";
import Bgm from "./sound/Bgm";

window.onload = () => {
    document.getElementById("play")
            ?.addEventListener("click", startGame);
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
    screen.setAttribute("key", "enter");
    return screen;
}
