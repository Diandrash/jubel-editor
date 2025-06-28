'use client';

import { useRef, useState } from 'react';

type Coord = { x: number; y: number };
type CropConfig = { crop: { x: number; y: number; width: number; height: number }; dest: Coord };

export default function EditorCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const [profileImg, setProfileImg] = useState<HTMLImageElement | null>(null);
    const [skinImg, setSkinImg] = useState<HTMLImageElement | null>(null);
    const [leftSkinImg, setLeftSkinImg] = useState<HTMLImageElement | null>(null);
    const [heroCountImg, setHeroCountImg] = useState<HTMLImageElement | null>(null);

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

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !profileImg || !skinImg || !leftSkinImg || !heroCountImg) return;
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
        leftSkins.forEach(({ crop, dest }) => drawCroppedImage(ctx, leftSkinImg, crop, dest, 1));
        drawCroppedImage(ctx, skinImg, skinCount.crop, skinCount.dest, 1.5);
        drawCroppedImage(ctx, heroCountImg, heroCount.crop, heroCount.dest, 2);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'akun-ml-result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#090040] text-white py-8 px-4">
            <h1 className="text-2xl text-center font-bold  text-[#FFCC00] mb-6">
                Custom Layout ML
            </h1>

            <div className="max-w-xl mx-auto space-y-4">
                {[
                    { label: 'Upload Profil ML', setter: setProfileImg },
                    { label: 'Upload Screenshot Skin', setter: setSkinImg },
                    { label: 'Upload Skin Kiri', setter: setLeftSkinImg },
                    { label: 'Upload Count Hero', setter: setHeroCountImg },
                ].map((item, idx) => (
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
                    onClick={drawCanvas}
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
