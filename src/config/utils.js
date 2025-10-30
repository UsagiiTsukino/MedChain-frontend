/* eslint-disable import/no-extraneous-dependencies */
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { grey, green, blue, red, orange } from '@ant-design/colors';


export const groupByPermission = (data) => {
    const groupedData = groupBy(data, x => x.module);
    return map(groupedData, (value, key) => {
        return { module: key, permissions: value };
    });
};



export const colorMethod = (method) => {
    switch (method) {
        case 'POST':
            return green[6]
        case 'PUT':
            return orange[6]
        case 'GET':
            return blue[6]
        case 'DELETE':
            return red[6]
        default:
            return grey[10];
    }
}