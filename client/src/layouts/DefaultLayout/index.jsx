import { useEffect } from 'react';
import Footer from '~/components/Footer';
import HeaderComponent from '~/layouts/DefaultLayout/HeaderDefaultLayout';

function DefaultLayout({ children, title }) {
    useEffect(() => {
        document.title = title ?? 'Maquiz';
    });
    return (
        <div className="relative">
            <HeaderComponent></HeaderComponent>
            <div className="bg-background ">
                <div className="container mx-auto px-2 md:px-5">{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
