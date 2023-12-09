
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('hilbertCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const order = 6;
    const N = Math.pow(2, order);
    const total = N * N;

    const path = new Array(total);

    const hilbert = (i) => {
        // pick point in 1st order
        const v = [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0]
        ][i & 3];

        for (let j = 1; j < order; ++j) {
            // update quadrant for 2nd order
            i = i >> 2;
            const index = i & 3;
            const len = Math.pow(2, j);
            if (index === 0) {
                const x = v[0];
                v[0] = v[1];
                v[1] = x;
            } else if (index === 1) { 
                v[1] += len;
            } else if (index === 2) {
                v[0] += len;
                v[1] += len;
            } else if (index === 3) {
                const x = len - 1 - v[0];
                v[0] = len - 1 - v[1];
                v[1] = x;
                v[0] += len;
            }
        }
        return v;
    }

    const hslRGB = (h, s, l) => {
        let r, g, b;

        if (s === 0) {
            r = g = b = 1;
        } else {
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    for (let i = 0; i < total; ++i) {
        path[i] = hilbert(i);
        let len = width / N;
        path[i][0] *= len;
        path[i][1] *= len;
        path[i][0] += len / 2;
        path[i][1] += len / 2;
    }

    const draw = (mode) => {
        let hue = 0;
        const sat = 1;
        const light = .5;


        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        ctx.lineTo(path[1][0], path[1][1])
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 10;
        let i = 1;
        if (mode === 0) {
            const rDraw = () => {
                const [r, g, b] = hslRGB(hue / 360, sat, light);
                if (i < total) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.moveTo(path[i - 1][0], path[i - 1][1]);
                    ctx.lineTo(path[i][0], path[i][1]);
                    ctx.stroke();
                    ctx.closePath();
                    i++;
                    
                    hue = (hue + .5) % 90;

                    requestAnimationFrame(rDraw);
                } else {
                    ctx.closePath();
                }
            }
            rDraw();
        } else if (mode === 1) {
            let l = 1;
            for (let k = 0; k < 100; ++k) {
                setTimeout(() => {
                for (let i = 1; i < path.length; ++i) {
                    const [r, g, b] = hslRGB(hue / 360, sat, light);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.moveTo(path[i - 1][0], path[i - 1][1]);
                    ctx.lineTo(path[i][0], path[i][1]);
                    ctx.stroke();
                    ctx.closePath();

                    hue = (hue + 10) % 100;
                    ++l
                }
                }, k * 200)
                /*
                for (let i = 1; i < path.length; ++i) {
                    const [r, g, b] = hslRGB(hue / 360, sat, light);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.moveTo(path[i - 1][0], path[i - 1][1]);
                    ctx.lineTo(path[i][0], path[i][1]);
                    ctx.stroke();
                    ctx.closePath();

                    hue = (hue + 10) % 44;
                }
                */
            }
        }
    }

    draw(1);
})
