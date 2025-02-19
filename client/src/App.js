import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { publicRoutes } from './routes';
import { updateUser } from './redux/slices/user.slice';
import DefaultLayout from './layouts/DefaultLayout';
import * as UserService from './services/user.service';
import './App.css';
import useMutationHooks from './hooks/useMutationHooks';
function App() {
    const dispatch = useDispatch();
    const handleUpdateUser = async () => {
        const res = await UserService.getUserDetail();
        if (res.data) {
            dispatch(updateUser({ ...res.data }));
        }
    };
    const getUserMutation = useMutationHooks(() => handleUpdateUser());
    useEffect(() => {
        getUserMutation.mutate();
    }, []);
    // useEffect(() => {
    //     const disableRightClick = (e) => e.preventDefault();
    //     document.addEventListener('contextmenu', disableRightClick);
    //     return () => document.removeEventListener('contextmenu', disableRightClick);
    // }, []);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        //nếu trang không là private thì hiển thị thì vế đầu sẽ là true => checkAuth true
                        //nếu trang là private thì vế đầu sẽ là false
                        //nhưng nếu là admin truy cập thì sẽ là điều kiện true thì sẽ hiển thị
                        const Page = route?.component;
                        return (
                            <Route
                                key={index}
                                path={route?.path}
                                element={
                                    <React.Suspense>
                                        <Layout key={index} header={route?.header} title={route?.title}>
                                            <Page />
                                        </Layout>
                                    </React.Suspense>
                                }
                            ></Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
