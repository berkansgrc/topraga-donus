import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NatureBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Lottie Animation Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <DotLottieReact
                    src="https://lottie.host/23c30e77-4a40-4469-a959-3840c91a756c/FfJ5w4WIvM.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Soft Overlay Texture for "Noise" Feel (Static) - Keeping this for texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

            {/* Gradient Overlay to blend edges if needed */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-base opacity-80"></div>
        </div>
    );
};

export default NatureBackground;
