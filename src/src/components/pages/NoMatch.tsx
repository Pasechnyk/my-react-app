import React from "react";
import { Button, Result } from 'antd';

const NoMatch: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Вибачте, дану сторінку не знайдено."
            extra={<Button type="primary">Повернутися до хати</Button>}
        />
    );
}
export default NoMatch;