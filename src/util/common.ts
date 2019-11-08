import uuid from 'uuid';

export class Common {

    /**
     * 获取uuid
     */
    public static uuid() {
        return uuid.v1().replace(/-/g, '');
    }
}