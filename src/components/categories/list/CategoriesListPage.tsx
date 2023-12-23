import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./types.ts";
import type {ColumnsType} from "antd/es/table";
import {Button, Table} from "antd";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";
import {Link} from "react-router-dom";

const CategoriesListPage : React.FC = () => {
    const [list, setList] = useState<ICategoryItem[]>(
        [
        ]
    );

    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    const columns : ColumnsType<ICategoryItem> = [
        {
            title: "#",
            dataIndex: "id"
        },
        {
            title: "Назва",
            dataIndex: "name",
        },
        {
            title: "Фото",
            dataIndex: "image",
            render: (imageName: string) => {
                return (
                    <img src={`${imagePath}${imageName}`} alt="фото" width={100}/>
                );
            }
        },
    ];

    useEffect(()=>{
        //console.log("useEffect working");
        http_common.get("/api/categories")
            .then(resp=> {
                console.log("Axios result", resp.data);
                setList(resp.data);
            });
    },[]);

    return (
        <>
            <h1>Список категорій</h1>
            {/* Use the Link component from react-router-dom */}
            <Link to="/create">
                {/* Use the Button component from antd */}
                <Button type="primary">
                    Додати категорію
                </Button>
            </Link>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"} />
        </>
    )
}

export default CategoriesListPage;