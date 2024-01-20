import React, {useEffect, useState} from "react";
import {IProductItem} from "./types.ts";
import {Card, List} from "antd";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";

const ProductsListPage : React.FC = () => {

    const [list, setList] = useState<IProductItem[]>([]);
    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;


    // Витягуємо дані з серверу
    useEffect(()=>{
        //console.log("useEffect working");
        // Надсилаємо запит GET до вказаної API адреси
        http_common.get("/api/products")
            .then(resp=> {
                // Відображаємо результат запиту Axios
                console.log("Axios result", resp.data);
                // Оновлюємо стан з отриманими даними
                setList(resp.data);
            });
    },[]);

    return (
        <>
            <h1>Список продуктів</h1>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={list}
                renderItem={(product: IProductItem) => (
                    <List.Item>
                        <Card
                            title={product.name}
                            cover={<img alt="фото" src={`${imagePath}${product.product_images[0].name}`} />}
                        >
                            {/* Additional properties from IProductItem */}
                            <p>Ціна: {product.price}</p>
                            <p>Кількість: {product.quantity}</p>
                            <p>Опис: {product.description}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    );
}

export default ProductsListPage;