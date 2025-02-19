import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 text">
            <div className="text-center">
                <p className="text-5xl font-semibold text-primary">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">Bạn đi nhầm phải không😨😨😨😨</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to={'/'}
                        className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Về trang chủ
                    </Link>
                    <Link href="#" className="text-sm font-semibold text-gray-900">
                        Liên hệ <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default NotFoundPage;
