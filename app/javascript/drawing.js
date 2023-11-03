
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById("patternCanvas");
    const ctx = canvas.getContext("2d");

    let isDrawing = false;
    let currentMode = 'free';
    let startX, startY;
    let tempImageData;
    let currentColor = '#000000';  // デフォルト色は黒

    // キャンバスの色はデフォルト白
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 線の色を変更
    window.changeColor = function(color) {
        currentColor = color;
        ctx.strokeStyle = color;
    }

    // ツールのモード確認
    window.drawMode = function(mode) {
      currentMode = mode;
    }

    // 全消し
    document.getElementById("clearAll").addEventListener("click", clearCanvas);
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 線画設定
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    function startDrawing(event) {
        isDrawing = true;
        // パスの開始
        ctx.beginPath();
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        if (currentMode === 'free') {
            ctx.moveTo(startX, startY);
        }else if(currentMode === 'straightLine'){
            tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }
    function stopDrawing(event) {
        if (currentMode === 'straightLine' && isDrawing) {
            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            ctx.lineTo(x, y);
            // 描画
            ctx.stroke();
        }
        isDrawing = false;
        // パスの終了
        ctx.closePath();
    }
    function draw(event) {
        if (!isDrawing) return;

        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        switch (currentMode) {
            case 'erase':
                ctx.globalCompositeOperation = "destination-out";
                ctx.lineWidth = 20;
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case 'free':
                ctx.globalCompositeOperation = "source-over";
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case 'straightLine':
                ctx.putImageData(tempImageData, 0, 0);
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
        }
    }

});