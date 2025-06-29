'use client';

import { useRef, useState } from 'react';

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
            crop: { x: 815, y: 585, width: 80, height: 50 },
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
        link.download = 'akun-ml-result.png';
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

            <div className="mt-10 flex justify-center ">
                <div
                    style={{
                        width: `${canvasSize.width * 0.4}px`,
                        height: "300px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="block"
                        style={{
                            transform: 'scale(0.6)',
                            // transformOrigin: 'top left',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
