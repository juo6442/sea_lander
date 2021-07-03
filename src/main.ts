import Environment from "./game/Environment";

window.onload = () => {
    const screen = createScreen();

    document.getElementById("container")
            ?.appendChild(screen);
}

function createScreen(): HTMLCanvasElement {
    const screen = document.createElement("canvas");
    screen.id = "screen";
    screen.width = Environment.VIEWPORT_WIDTH;
    screen.height = Environment.VIEWPORT_HEIGHT;
    return screen;
}
