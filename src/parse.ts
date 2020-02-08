import {emit} from 'cluster';

export const parse = (rawSource: string) => {
    //console.log('parse got raw file\n', rawSource);

    const source = rawSource.split('\n');
    //console.log(source.map(s => [s, s.length]));

    const output = [];
    let position = [0, 0];
    let direction = [1, 0];
    let character: string;
    while (character = scan()) {
        //console.log(position[1], position[0], 'CHARACTER', character);

        if (isToken(character)) {
            const res = handleToken(character);
            if (!res) break;
        }

        emit(character);
        advance();
    }
    return output;

    function scan() {
        return source[position[1]][position[0]];
    }

    function handleToken(token: Token) {
        if (directions[token]) {
            direction = directions[token];
            return true;
        }

        if (token === Token.Stop) return false;

        return true;
    }

    function emit(character: string) {
        if (character === ' ') return;

        if (isToken(character)) {
            const emitValue = tokenEmitValues[character];
            if (emitValue) output.push(emitValue);
            return;
        }

        output.push(character);
    }

    function advance() {
        position[0] += direction[0];
        position[1] += direction[1];
    }
};

enum Token {
    Up = '⬆',
    Down = '⬇',
    Left = '⬅',
    Right = '➡',
    UpLeft = '↖',
    UpRight = '↗',
    DownLeft = '↙',
    DownRight = '↘',
    Space = '~',
    NewLine = '^',
    Stop = '§',
}
const tokens = Object.values(Token);

const isToken = (character: string): character is Token => tokens.includes(character as Token);

const tokenEmitValues: {[key in Token]?: string} = {
    [Token.Space]: ' ',
    [Token.NewLine]: '\r\n',
};

const directions: {[key in Token]?: [number, number]} = {
    [Token.Left]: [-1, 0],
    [Token.Right]: [1, 0],
    [Token.Up]: [0, -1],
    [Token.Down]: [0, 1],
    [Token.UpLeft]: [-1, -1],
    [Token.UpRight]: [1, -1],
    [Token.DownLeft]: [-1, 1],
    [Token.DownRight]: [1, 1],
};
