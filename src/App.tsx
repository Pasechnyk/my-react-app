import {Route, Routes} from "react-router-dom";
import ContainerDefault from "./components/containers/default/ContainerDefault.tsx";
import NoMatch from "./components/pages/NoMatch.tsx";
import CategoriesListPage from "./components/categories/list/CategoriesListPage.tsx";
import CategoryCreatePage from "./components/categories/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./components/categories/edit/CategoryEditPage.tsx";
import React from "react";

const App: React.FC = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<ContainerDefault />}>
                    <Route index element={<CategoriesListPage />} />
                    <Route path={'create'} element={<CategoryCreatePage />} />
                    <Route path={'edit/:id'} element={<CategoryEditPage />} />

                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;