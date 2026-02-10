import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden font-primary">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#e5c4b5]/30 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#f4ebce]/50 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-[#8b171b]/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-2xl w-full mx-4 text-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">
                    <h1 className="text-4xl md:text-5xl font-serifSita text-[#8b171b] mb-4">
                        Oops! Something went wrong.
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        We encountered an unexpected error. Our team has been notified.
                    </p>
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-lg text-left text-sm font-mono overflow-auto max-h-48">
                            <p className="font-bold mb-2">Error Details:</p>
                            <p>{error.statusText || error.message}</p>
                        </div>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3.5 bg-[#8b171b] text-white rounded-full font-medium transition-all hover:bg-[#a62024] hover:shadow-lg hover:shadow-[#8b171b]/20"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
