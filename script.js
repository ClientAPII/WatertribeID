document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'WT_ID_CARD-EMPTY.png';  

  
    const seals = {
        normal: new Image(),
        military: new Image(),
        hro: new Image(),
        royalty: new Image(),
        bloodbender: new Image(),
        dead: new Image(),
    };
    
    seals.normal.src = 'seals/Normal_Seal.png';  // Path to Normal Seal
    seals.military.src = 'seals/Military_seal.png';  // Path to Military Seal
    seals.hro.src = 'seals/HRO_seal.png';  // Path to HRO Seal
    seals.royalty.src = 'seals/Royalty_Seal.png';  // Path to Royalty Seal
    seals.bloodbender.src = 'seals/Blood_Seal.png';  // Path to Bloodbender Seal
    seals.dead.src = 'seals/Dead_Seal.png';  // Path to Dead Seal

    // Object storing positions and sizes for each seal
    const sealPositions = {
        normal: { x: 657, y: -102, width: 670, height: 620 },
        military: { x: 665, y: 55, width: 650, height: 600 },
        hro: { x: 668, y: 200, width: 650, height: 600 },
        royalty: { x: 449, y: 163, width: 650, height: 600 },  
        bloodbender: { x: 455, y: 160, width: 650, height: 600 },  
        dead: { x: 427, y: 145, width: 650, height: 600 },  
    };

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        updateIDCard();
    };

    image.onerror = function() {
        console.error("Failed to load background image");
    };

    const uploadImageInput = document.getElementById('uploadImage');
    const imageEditorModal = document.getElementById('imageEditorModal');
    let croppieInstance = null;

    uploadImageInput.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (!croppieInstance) {
                    croppieInstance = new Croppie(document.getElementById('croppieContainer'), {
                        viewport: { width: 180, height: 150, type: 'square' }, 
                        boundary: { width: 300, height: 300 },
                        enableOrientation: true,
                        showZoomer: true,
                        enableExif: true
                    });
                }
                croppieInstance.bind({ url: e.target.result });
                imageEditorModal.style.display = 'flex';
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    document.getElementById('cropImageBtn').addEventListener('click', function() {
        croppieInstance.result({ type: 'canvas', size: 'viewport' }).then(function(croppedImage) {
            userImage = new Image();
            userImage.src = croppedImage;
            userImage.onload = updateIDCard;
            imageEditorModal.style.display = 'none';
        });
    });

    document.getElementById('idCardForm').addEventListener('input', updateIDCard);
    document.getElementById('sealSelect').addEventListener('change', updateIDCard);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        let lines = [];

        words.forEach((word) => {
            let testLine = line + word + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        lines.push(line.trim());  
        return lines;
    }

    function updateIDCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = "13px 'Minecraftia'";
        ctx.fillStyle = "white";  

        
        const rpn = document.getElementById('rpn').value;
        const birthYear = document.getElementById('birthYear').value;
        const gender = document.getElementById('gender').value;
        const cardId = document.getElementById('cardId').value;
        const element = document.getElementById('element').value;
        const subelement = document.getElementById('subelement').value;
        const rank = document.getElementById('rank').value;
        const housing = document.getElementById('housing').value;
        const ign = document.getElementById('ign').value;
        const minorOrAdult = document.getElementById('minorOrAdult').value;
        let selectedSeal = document.getElementById('sealSelect').value;

       
        if (!selectedSeal) {
            selectedSeal = 'normal';
        }

       
        ctx.fillText(rpn, 400, 216);             
        ctx.fillText(birthYear, 450, 239);      
        ctx.fillText(gender, 430, 263);         
        ctx.fillText(cardId, 450, 287);         
        ctx.fillText(element, 430, 327);        
        ctx.fillText(subelement, 455, 349);     
        ctx.fillText(ign, 608, 216);            
        ctx.fillText(minorOrAdult, 720, 239);   

        const rankMaxWidth = 140; 
        const rankX = 154;
        const rankY = 424;
        const lineHeight = 18;
        let userImage = null;

        const rankLines = wrapText(ctx, rank, rankX, rankY, rankMaxWidth, lineHeight);
        rankLines.forEach((line, index) => {
            ctx.fillText(line, rankX, rankY + (index * lineHeight));
        });

        const housingMaxWidth = 155; 
        const housingX = 330;
        const housingY = 424;

        const housingLines = wrapText(ctx, housing, housingX, housingY, housingMaxWidth, lineHeight);
        housingLines.forEach((line, index) => {
            ctx.fillText(line, housingX, housingY + (index * lineHeight));
        });

        const sealImage = seals[selectedSeal];
        const sealConfig = sealPositions[selectedSeal]; 
        if (sealImage && sealConfig) {
            ctx.drawImage(sealImage, sealConfig.x, sealConfig.y, sealConfig.width, sealConfig.height);  
        }

        if (userImage) {
            ctx.drawImage(userImage, 157, 200, 180, 155);
        }
    }

    document.getElementById('downloadBtn').addEventListener('click', function() {
        updateIDCard();
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'Water_Tribe_ID_Card.png';
        link.click();
    });

    document.getElementById('copyBtn').addEventListener('click', function() {
        updateIDCard();
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                //alert('ID Card copied to clipboard!');
            }).catch(err => {
                //alert('Failed to copy ID Card.');
            });
        });
    });
});
