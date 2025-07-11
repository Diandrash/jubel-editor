'use client';

import { useEffect, useRef, useState } from 'react';
import { wrapText } from '../_helper/wraptext';
import moment from 'moment';

type Coord = { x: number; y: number };
type CropConfig = { crop: { x: number; y: number; width: number; height: number }; dest: Coord };
type TemplateLayout = 'RELL BASIC LAYOUT' | 'HAMZZ STORE LAYOUT'

export default function EditorCanvas() {

    // Canvas Configuration
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // Template Layout
    const [selectedTemplateLayout, setSelectedTemplateLayout] = useState<TemplateLayout>('RELL BASIC LAYOUT')


    const [profileImg, setProfileImg] = useState<HTMLImageElement | null>(null);
    const [skinImg, setSkinImg] = useState<HTMLImageElement | null>(null);
    const [secondSkinImg, setSecondSkinImg] = useState<HTMLImageElement | null>(null);

    // Rell Material Image
    const [heroCountImg, setHeroCountImg] = useState<HTMLImageElement | null>(null);

    // Hamzz Material Image
    const [recallImg, setRecallImg] = useState<HTMLImageElement | null>(null);
    const [spawnImg, setSpawnImg] = useState<HTMLImageElement | null>(null);
    const [emoteImg, setEmoteImg] = useState<HTMLImageElement | null>(null);
    const [eliminationImg, setEliminationImg] = useState<HTMLImageElement | null>(null);
    const [magicWheelImg, setMagicWheelImg] = useState<HTMLImageElement | null>(null);


    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (img: HTMLImageElement) => void,
        resizeTo?: { width: number; height: number }
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            if (!resizeTo) {
                setter(img); // langsung set kalau nggak perlu resize
                return;
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = resizeTo.width;
            tempCanvas.height = resizeTo.height;

            const ctx = tempCanvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0, resizeTo.width, resizeTo.height);

            const resized = new Image();
            resized.src = tempCanvas.toDataURL();
            resized.onload = () => setter(resized);
        };
    };

    const drawCroppedImage = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        crop: { x: number; y: number; width: number; height: number },
        dest: { x: number; y: number },
        scale = 1
    ) => {
        ctx.drawImage(
            img,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            dest.x,
            dest.y,
            crop.width * scale,
            crop.height * scale
        );
    };

    const drawRellCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !profileImg || !skinImg || !secondSkinImg || !heroCountImg) {
            alert('Please fill all required field')
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = profileImg.width;
        canvas.height = profileImg.height;
        setCanvasSize({ width: profileImg.width, height: profileImg.height });

        ctx.drawImage(profileImg, 0, 0);

        const card = { width: 154, height: 250 };
        const spacing = { x: 180, tolerance: 5.8, y: 284 };
        const cropStartX = 363;
        const cropStartYTop = 78;
        const cropStartYBot = cropStartYTop + spacing.y;

        const destStartX = 860;
        const destStartYTop = 40;
        const destStartYBot = 310;
        const destStepX = 160;

        const generateSkins = (rowY: number, destY: number): CropConfig[] =>
            Array.from({ length: 4 }, (_, i) => ({
                crop: {
                    x: cropStartX + i * spacing.x + i * spacing.tolerance,
                    y: rowY,
                    width: card.width,
                    height: card.height,
                },
                dest: {
                    x: destStartX + i * destStepX,
                    y: destY,
                },
            }));

        const skins: CropConfig[] = [
            ...generateSkins(cropStartYTop, destStartYTop),
            ...generateSkins(cropStartYBot, destStartYBot),
        ];

        const leftSkins: CropConfig[] = [
            {
                crop: { x: cropStartX, y: cropStartYTop, width: card.width, height: card.height },
                dest: { x: 60, y: destStartYTop },
            },
            {
                crop: {
                    x: cropStartX + spacing.x + spacing.tolerance,
                    y: cropStartYTop,
                    width: card.width,
                    height: card.height,
                },
                dest: { x: 60, y: destStartYBot },
            },
        ];

        const skinCount: CropConfig = {
            crop: { x: 1180, y: 440, width: 160, height: 70 },
            dest: { x: destStartX, y: 580 },
        };

        const heroCount: CropConfig = {
            crop: { x: 805, y: 585, width: 100, height: 50 },
            dest: { x: destStartX + 260, y: 580 },
        };

        skins.forEach(({ crop, dest }) => drawCroppedImage(ctx, skinImg, crop, dest, 1));
        leftSkins.forEach(({ crop, dest }) => drawCroppedImage(ctx, secondSkinImg, crop, dest, 1));
        drawCroppedImage(ctx, skinImg, skinCount.crop, skinCount.dest, 1.5);
        drawCroppedImage(ctx, heroCountImg, heroCount.crop, heroCount.dest, 2);
    };

    const drawHamzCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !profileImg || !skinImg || !secondSkinImg || !recallImg || !spawnImg || !emoteImg || !eliminationImg || !magicWheelImg) {
            alert('Please fill all required field')
            return
        };
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = profileImg.width;
        canvas.height = profileImg.height;
        setCanvasSize({ width: profileImg.width, height: profileImg.height });

        ctx.drawImage(profileImg, 0, 0);

        const card = { width: 154, height: 250 };
        const spacing = { x: 180, tolerance: 5.8, y: 284 };
        const cropStartX = 363;
        const cropStartYTop = 78;
        const cropStartYBot = cropStartYTop + spacing.y;

        const destStartX = 840;
        const destStartYTop = 30;
        const destStartYBot = 268;
        const destStepX = 148;

        const generateSkins = (rowY: number, destY: number): CropConfig[] =>
            Array.from({ length: 4 }, (_, i) => ({
                crop: {
                    x: cropStartX + i * spacing.x + i * spacing.tolerance,
                    y: rowY,
                    width: card.width,
                    height: card.height,
                },
                dest: {
                    x: destStartX + i * destStepX,
                    y: destY,
                },
            }));

        const skins: CropConfig[] = [
            ...generateSkins(cropStartYTop, destStartYTop),
            ...generateSkins(cropStartYBot, destStartYBot),
        ];

        const leftSkins: CropConfig[] = [
            {
                crop: { x: cropStartX, y: cropStartYTop, width: card.width, height: card.height },
                dest: { x: destStartX + destStepX * 4, y: destStartYTop },
            },
            {
                crop: {
                    x: cropStartX + spacing.x + spacing.tolerance,
                    y: cropStartYTop,
                    width: card.width,
                    height: card.height,
                },
                dest: { x: destStartX + destStepX * 4, y: destStartYBot },
            },
        ];

        const collectionInfo: CropConfig = {
            crop: {
                x: cropStartX + spacing.x * 4 + 20,
                y: cropStartYTop,
                width: 300,
                height: 550,
            },
            dest: { x: 25, y: destStartYBot - 15 },
        }

        const goldInfo: CropConfig = {
            crop: {
                x: 1040,
                y: 10,
                width: 280,
                height: 50,
            },
            dest: { x: 25, y: destStartYBot - 65 },
        }

        const magicWheelInfo: CropConfig = {
            crop: {
                x: 1040,
                y: 10,
                width: 280,
                height: 50,
            },
            dest: { x: 25, y: destStartYBot - 115 },
        }

        const recallInfo: CropConfig = {
            crop: {
                x: 1170,
                y: 120,
                width: 110,
                height: 110,
            },
            dest: { x: 25, y: destStartYTop },
        }

        const eliminationInfo: CropConfig = {
            crop: {
                x: 1170,
                y: 120,
                width: 110,
                height: 110,
            },
            dest: { x: 25 + 120, y: destStartYTop },
        }

        const emoteInfo: CropConfig = {
            crop: {
                x: 745,
                y: 120,
                width: 635,
                height: 110,
            },
            dest: { x: destStartX + 230, y: destStartYBot + 245 },
        }

        const spawnInfo: CropConfig = {
            crop: {
                x: 745,
                y: 120,
                width: 635,
                height: 110,
            },
            dest: { x: destStartX + 230, y: destStartYBot + 335 },
        }

        // const skinCount: CropConfig = {
        //     crop: { x: 1180, y: 440, width: 160, height: 70 },
        //     dest: { x: destStartX, y: 580 },
        // };

        // const heroCount: CropConfig = {
        //     crop: { x: 815, y: 585, width: 80, height: 50 },
        //     dest: { x: destStartX + 260, y: 580 },
        // };

        skins.forEach(({ crop, dest }) => drawCroppedImage(ctx, skinImg, crop, dest, 0.95));
        leftSkins.forEach(({ crop, dest }) => drawCroppedImage(ctx, secondSkinImg, crop, dest, 0.95));

        drawCroppedImage(ctx, skinImg, collectionInfo.crop, collectionInfo.dest, 0.8);
        drawCroppedImage(ctx, recallImg, goldInfo.crop, goldInfo.dest, 0.865);
        drawCroppedImage(ctx, magicWheelImg, magicWheelInfo.crop, magicWheelInfo.dest, 0.865);
        drawCroppedImage(ctx, recallImg, recallInfo.crop, recallInfo.dest, 1.1);
        drawCroppedImage(ctx, eliminationImg, eliminationInfo.crop, eliminationInfo.dest, 1.1);
        drawCroppedImage(ctx, emoteImg, emoteInfo.crop, emoteInfo.dest, 0.8);
        drawCroppedImage(ctx, spawnImg, spawnInfo.crop, spawnInfo.dest, 0.8);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `result-layout-${moment().format('YYYY-MM-DD_HH-mm-ss')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const rellInputFields = [
        { label: 'Upload Profil ML', setter: setProfileImg },
        { label: 'Upload Screenshot Skin', setter: setSkinImg },
        { label: 'Upload Screenshot Skin Kedua (Diambil 2 kiri atas pertama)', setter: setSecondSkinImg },
        { label: 'Upload Count Hero', setter: setHeroCountImg },
    ]

    const hamzInputFields = [
        { label: 'Upload Profil ML', setter: setProfileImg },
        { label: 'Upload Screenshot Skin', setter: setSkinImg },
        { label: 'Upload Screenshot Skin Kedua (Diambil 2 kiri atas pertama)', setter: setSecondSkinImg },
        { label: 'Upload Recall Image (Tidak perlu di-expand)', setter: setRecallImg },
        { label: 'Upload Spawn Image (Harus di-expand)', setter: setSpawnImg },
        { label: 'Upload Emote Image (Harus di-expand)', setter: setEmoteImg },
        { label: 'Upload Elimination Image (Tidak perlu di-expand)', setter: setEliminationImg },
        { label: 'Upload Magic Wheel Image', setter: setMagicWheelImg },
    ]

    const [showInstaForm, setShowInstaForm] = useState(false);
    const [instaTitle, setInstaTitle] = useState('');
    const [instaPrice, setInstaPrice] = useState('');
    const [heroCount, setHeroCount] = useState('');
    const [skinCount, setSkinCount] = useState('');
    const [captionMaknyuss, setCaptionMaknyuss] = useState('');
    const [captionRellJubel, setCaptionRellJubel] = useState('');
    const [captionStatusWA, setCaptionStatusWA] = useState('');

    const [igLayoutImg, setIgLayoutImg] = useState<HTMLImageElement | null>(null);

    // Load saat component mount (atau onClick juga boleh)
    useEffect(() => {
        const img = new Image();
        img.src = '/images/layout-instagram-post.png';
        img.onload = () => setIgLayoutImg(img);
    }, []);

    const igCanvasRef = useRef<HTMLCanvasElement>(null);


    const generateInstagramLayout = () => {
        const baseCanvas = canvasRef.current;
        const igCanvas = igCanvasRef.current;
        if (!baseCanvas || !igLayoutImg || !igCanvas) return;

        const ctx = igCanvas.getContext('2d');
        if (!ctx) return;

        igCanvas.width = igLayoutImg.width;
        igCanvas.height = igLayoutImg.height;

        // Draw background
        ctx.drawImage(igLayoutImg, 0, 0);

        // Preview result
        const scale = 0.57;
        const previewWidth = baseCanvas.width * scale;
        const previewHeight = baseCanvas.height * scale;
        const previewX = 85;
        const previewY = 300;
        ctx.drawImage(baseCanvas, previewX, previewY, previewWidth, previewHeight);

        // Title
        ctx.fillStyle = '#090040';
        ctx.font = 'bold 60px Poppins';
        ctx.textAlign = 'center';
        // ctx.fillText(instaTitle, igCanvas.width / 2, 850);
        wrapText(ctx, instaTitle, igCanvas.width / 2, 840, 1000, 70); // maxWidth 800, lineHeight 70

        // Price
        ctx.fillStyle = '#ffff';
        ctx.font = 'bold 70px Poppins';
        ctx.fillText(instaPrice, igCanvas.width / 2, 1115);
    };

    const [detailImages, setDetailImages] = useState<HTMLImageElement[]>([]);
    const [generatedDetailCanvases, setGeneratedDetailCanvases] = useState<HTMLCanvasElement[]>([]);

    const generateDetailSlides = () => {
        const canvasList: HTMLCanvasElement[] = [];

        const layout = {
            width: 1080,
            height: 1350,
            positions: [
                { x: 0, y: 0, width: 1080, height: 450 },
                { x: 0, y: 450, width: 1080, height: 450 },
                { x: 0, y: 900, width: 1080, height: 450 },
            ]
        };

        const grouped = Array.from({ length: Math.ceil(detailImages.length / 3) }, (_, i) =>
            detailImages.slice(i * 3, i * 3 + 3)
        );

        grouped.forEach((group, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = layout.width;
            canvas.height = layout.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            group.forEach((img, i) => {
                const pos = layout.positions[i];
                ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
            });

            canvasList.push(canvas);
        });

        setGeneratedDetailCanvases(canvasList);
    };
    const handleDownloadAllPostIG = () => {
        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');

        // 1. Download main preview (hasil generate akun ML)
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `preview-akun-${timestamp}.png`;
            link.href = canvasRef.current.toDataURL();
            setTimeout(() => {
                link.click();
            }, 200); // delay kecil
        }

        // 2. Download IG Cover Layout (canvas Instagram post)
        if (igCanvasRef.current) {
            const link = document.createElement('a');
            link.download = `ig-cover-${timestamp}.png`;
            link.href = igCanvasRef.current.toDataURL();
            link.click();
        }

        // 3. Download semua detail slides (per 3 gambar)
        generatedDetailCanvases.forEach((canvas, idx) => {
            const link = document.createElement('a');
            link.download = `slide-${idx + 2}-${timestamp}.png`;
            link.href = canvas.toDataURL();
            setTimeout(() => {
                link.click();
            }, (idx + 1) * 500); // delay biar tidak bentrok
        });

        setTimeout(() => {
            const img = new Image();
            img.src = "/images/ending-slide.png";

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = `ending-slide-${timestamp}.png`;
                link.href = canvas.toDataURL();
                link.click();
            };
        }, (generatedDetailCanvases.length + 1) * 500);
    };

    const generateCaptionMaknyuss = () => {
        const result = `
❗NO PENJUAL ADA DIBAWAH ❗ PAKAI REKBER (JASA ADMIN ) SUPAYA AMAN❗
Titipakunmobilelegends
Profile akun
Nickname : cek ss
Divisi rank kini : cek ss
Divisi rank Tertinggi : cek ss
Hero : ${heroCount || '-'}
Emblem :

Total Skin : ${skinCount || '-'}
Spek Skin :
item lain  :( Emote , recall , diamond dll )
Change name : on/off
Change flag   : on/off

Harga : ${instaPrice || '-'}
Judul Postingan : ${instaTitle || '-'}

Bind Akun
Login   = Moonton take sgmail
Minus   = -plat (dev bersih)

Minat? Full Screenshot? Langsung hubungi Penjual 

📞 Kontak IG : @rell.jubel
📞 Kontak WA : +62 895-3215-41079

📌CARA BELI :
1. Pilih Akun Yang Akan Dibeli
2. Screenshot Akun Yang Akan Dibeli 
3. Hubungi Penjual Melalui DM Atau WA di Nomor Yang Tertera
4. Setelah Mendapat Kesepakatan Dengan Penjual Hubungi Admin
Note= (Dilarang transfer langsung kepenjual , wajib pakai jasa admin REKBER)

No rekber (admin): 0813-7171-1406

#mlmurah #Akunmlmurah #jualakunml #jualakunmobilelegends #smurf #jualakun #akun #jual #maknyuss #akunadmin #mobilelegends #mobile
`.trim();
        setCaptionMaknyuss(result);
    }

    const generateCaptionRellJubel = () => {
        const result = `
✅AKUN READY✅

Harga: ${instaPrice}
Login via: Moonton take sgmail
Minus : -plat (dev bersih)


📲 Jika minat bisa langsung hubungi ke WA ‪+62 895-3215-41079‬
Atau klik link WA.me yang ada di bio!

⚠ Disclaimer:
Semua akun yang dijual merupakan hasil beli dari orang lain. Pahami resikonya dan jadilah pembeli yang cerdas!
Setelah transaksi selesai, segala bentuk resiko akun sepenuhnya ditanggung pembeli. Penjual tidak bertanggung jawab atas hal apa pun setelah akun diserahkan.
Amankan akun kamu secepat mungkin setelah pembelian!

#jualakunml #akunmlmurah #stokakunml #mlbbindonesia #akunml #mlbbmurah #mlbb #mlsultan #mlready #jualakunmobilelegends #akunmlsultan #mlbbakun #akunmllegend #jualakunmlmurah #akunmlori #mlbbterpercaya #mlbbstore #jualakunmlbb #mlakun #mlbbakunmurah #mlbbmurahmeriah #mlmurah #akunmlready #mlakunmurah #jualakunmlsultan #mlbbakunready #jualml #jualakunmlori #jualakunmlterpercaya #akunmlindonesia
`.trim();
        setCaptionRellJubel(result);
    }

    const generateCaptionStatusWa = () => {
        const result = `
${instaPrice}
${instaTitle}

Hero ${heroCount}
Skin ${skinCount}
Monsep -plat 
Take sgmail
`.trim();
        setCaptionStatusWA(result);
    }

    return (
        <div className="min-h-screen bg-[#090040] text-white py-8 px-4">
            <h1 className="text-2xl text-center font-bold  text-[#FFCC00] mb-6">
                Custom Layout ML
            </h1>

            <div className="max-w-xl mx-auto mb-6 text-white flex flex-col gap-4">
                <label className="block mb-1 text-sm font-medium text-[#FFCC00]">Pilih Layout</label>
                <select
                    value={selectedTemplateLayout}
                    onChange={(e) => setSelectedTemplateLayout(e.target.value as TemplateLayout)}
                    className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B13BFF]"
                >
                    <option value="RELL BASIC LAYOUT">Layout Rell</option>
                    <option value="HAMZZ STORE LAYOUT">Layout Hamz</option>
                </select>
                <img
                    src={selectedTemplateLayout == 'RELL BASIC LAYOUT' ? '/images/rell.png' : '/images/hamz.jpg'}
                    className='max-w-xl'
                    style={{
                        // width: "100%"
                    }}
                />
            </div>



            <div className="max-w-xl mx-auto space-y-4">
                {(selectedTemplateLayout == 'RELL BASIC LAYOUT' ? rellInputFields : hamzInputFields).map((item, idx) => (
                    <label key={idx} className="block">
                        <span className="text-sm text-[#FFCC00]">{item.label}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={
                                (e) => handleImageUpload(e, item.setter, { width: 1600, height: 720 })}
                            className="mt-1 w-full rounded border border-gray-300 bg-white text-black file:mr-2 file:rounded file:border-0 file:bg-[#471396] file:px-3 file:py-1 file:text-white"
                        />
                    </label>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => {
                        if (selectedTemplateLayout == 'RELL BASIC LAYOUT') {
                            drawRellCanvas()
                        } else if (selectedTemplateLayout == 'HAMZZ STORE LAYOUT') {
                            drawHamzCanvas()
                        }
                    }}
                    className="bg-[#471396] hover:bg-[#a02ae8] text-white px-5 py-2 rounded shadow"
                >
                    🔄 Generate Preview
                </button>
                <button
                    onClick={handleDownload}
                    className="bg-[#FFCC00] text-black px-5 py-2 rounded shadow hover:bg-yellow-400"
                >
                    ⬇️ Download Gambar
                </button>
            </div>

            <div className="preview-area mt-10 flex justify-center ">
                <div
                    style={{
                        // width: `${canvasSize.width * 0.4}px`,
                        width: "100vw",
                        height: "350px",
                        display: "flex",
                        justifyContent: "center",
                        // backgroundColor: "gray",
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="block"
                        style={{
                            transform: 'scale(0.4)',
                            // transformOrigin: 'top left',
                        }}
                    />
                </div>

            </div>

            {selectedTemplateLayout === "RELL BASIC LAYOUT" && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setShowInstaForm(!showInstaForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                        🎨 Create Instagram Layout
                    </button>
                </div>
            )}

            {showInstaForm && (
                <div className="mt-4 max-w-sm mx-auto space-y-4">
                    <input
                        type="text"
                        placeholder="Judul Akun ML"
                        value={instaTitle}
                        onChange={(e) => setInstaTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Harga (contoh: Rp 150.000)"
                        value={instaPrice}
                        onChange={(e) => setInstaPrice(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Jumlah Hero (Contoh : 126)"
                        value={heroCount}
                        onChange={(e) => setHeroCount(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Jumlah Skin (Contoh : 226)"
                        value={skinCount}
                        onChange={(e) => setSkinCount(e.target.value)}
                        className="w-full px-4 py-2 rounded border border-gray-300 text-white"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const imgs: HTMLImageElement[] = [];
                            let loadedCount = 0;

                            files.forEach((file) => {
                                const img = new Image();
                                img.src = URL.createObjectURL(file);
                                img.onload = () => {
                                    imgs.push(img);
                                    loadedCount++;
                                    if (loadedCount === files.length) {
                                        setDetailImages(imgs);
                                    }
                                };
                            });
                        }}
                        className="w-full px-4 py-2 rounded border border-gray-300 text-white"
                    />

                    <button
                        onClick={() => {
                            generateInstagramLayout()
                            generateDetailSlides()
                        }}
                        className="w-full bg-[#FFCC00] text-black font-semibold px-4 py-2 rounded shadow hover:bg-yellow-400"
                    >
                        Generate Post Instagram
                    </button>

                    <button
                        onClick={() => {
                            generateCaptionMaknyuss()
                            generateCaptionRellJubel()
                            generateCaptionStatusWa()
                        }}
                        className="w-full bg-[#FFCC00] text-black font-semibold px-4 py-2 rounded shadow hover:bg-yellow-400"
                    >
                        Generate Caption
                    </button>


                    <button
                        onClick={handleDownloadAllPostIG}
                        className="w-full bg-[#FFCC00] text-black font-semibold px-4 py-2 rounded shadow hover:bg-yellow-400"
                    >
                        Download All
                    </button>
                </div>
            )}

            {showInstaForm && (
                <div className="mt-6">
                    <div className="flex justify-center overflow-x-auto ">
                        <canvas
                            ref={igCanvasRef}
                            className="border rounded shadow max-w-full"
                            style={{
                                backgroundColor: 'white',
                                maxWidth: '90%',
                                height: 'auto',
                                transform: 'scale(1)',
                            }}
                        />
                    </div>
                </div>
            )}

            {generatedDetailCanvases.length > 0 && (
                <div className="mt-1">
                    <div className="flex flex-col justify-center gap-0 items-center">
                        {generatedDetailCanvases.map((canvas, idx) => (
                            <div key={idx} className="text-center self-center">
                                <canvas
                                    ref={(ref) => {
                                        if (ref) {
                                            const ctx = ref.getContext('2d');
                                            if (ctx) {
                                                ctx.drawImage(canvas, 0, 0);
                                            }
                                        }
                                    }}
                                    width={canvas.width}
                                    height={canvas.height}
                                    style={{
                                        maxWidth: "100%",
                                        transform: "scale(0.9)",
                                    }}
                                    className="border rounded shadow max-w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {captionMaknyuss && (
                <div className="relative mt-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(captionMaknyuss);
                        }}
                        className="absolute top-2 right-2 bg-[#B13BFF] text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                        📋 Copy
                    </button>

                    <textarea
                        value={captionMaknyuss}
                        readOnly
                        rows={15}
                        className="w-full px-4 py-3 rounded border border-gray-300 bg-[#0f0030] text-white whitespace-pre-line"
                    />
                </div>
            )}

            {captionRellJubel && (
                <div className="relative mt-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(captionRellJubel);
                        }}
                        className="absolute top-2 right-2 bg-[#B13BFF] text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                        📋 Copy
                    </button>

                    <textarea
                        value={captionRellJubel}
                        readOnly
                        rows={15}
                        className="w-full px-4 py-3 rounded border border-gray-300 bg-[#0f0030] text-white whitespace-pre-line"
                    />
                </div>
            )}

            {captionStatusWA && (
                <div className="relative mt-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(captionStatusWA);
                        }}
                        className="absolute top-2 right-2 bg-[#B13BFF] text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                        📋 Copy
                    </button>

                    <textarea
                        value={captionStatusWA}
                        readOnly
                        rows={15}
                        className="w-full px-4 py-3 rounded border border-gray-300 bg-[#0f0030] text-white whitespace-pre-line"
                    />
                </div>
            )}



        </div>
    );
}
