import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./types.ts";
import type {ColumnsType} from "antd/es/table";
import {Button, Modal, Table} from "antd";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";
import {Link} from "react-router-dom";

const CategoriesListPage : React.FC = () => {

    const [list, setList] = useState<ICategoryItem[]>([]);
    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    // Функція обробки видалення
    const handleDelete = (category: ICategoryItem) => {
        Modal.confirm({
            title: "Видалення категорії",
            content: `Ви впевнені, що хочете видалити категорію "${category.name}"?`,
            okText: "Так",
            cancelText: "Скасувати",
            onOk: () => deleteCategory(category.id),
        });
    };

    // Функція надсилання запиту на видалення на сервер по ID
    const deleteCategory = (categoryId: number) => {
        http_common.delete(`/api/categories/${categoryId}`)
            .then(() => {
                setList((prevList) => prevList.filter((category) => category.id !== categoryId));
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
            });
    };

    // Дії редагування та видалення
    const actionColumns = {
        title: "Дії",
        render: (_text: string, record: ICategoryItem) => (
            <>
                <Link to={`/edit/${record.id}`}>
                    <Button type="primary" style={{ marginRight: 8 }}>
                        Редагувати
                    </Button>
                </Link>
                <Button type="primary" danger onClick={() => handleDelete(record)}>
                    Видалити
                </Button>
            </>
        ),
    };

    // Вигляд колонок у таблиці з Ant дизайном
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
        actionColumns,
    ];

    // Коментування
    // Витяг даних з серверу
    useEffect(()=>{
        //console.log("useEffect working");
        // Надсилаємо запит GET до вказаної API адреси
        http_common.get("/api/categories")
            .then(resp=> {
                // Відображаємо результат запиту Axios
                console.log("Axios result", resp.data);
                // Оновлюємо стан з отриманими даними
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
