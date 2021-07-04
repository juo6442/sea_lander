import Environment from "./game/Environment";
import Game from "./game/Game";

window.onload = () => {
    const screen = createScreen();
    document.getElementById("container")
            ?.appendChild(screen);

    const game = new Game(screen);
    game.start();
}

function createScreen(): HTMLCanvasElement {
    const screen = document.createElement("canvas");
    screen.id = "screen";
    screen.width = Environment.VIEWPORT_WIDTH;
    screen.height = Environment.VIEWPORT_HEIGHT;
    return screen;
}
