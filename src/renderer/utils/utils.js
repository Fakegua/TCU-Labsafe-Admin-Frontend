export default {
    formatTime(time) {
        let t = new Date(time);
        let year = t.getFullYear();
        let month = t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1;
        let date = t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
        return `${year}年${month}月${date}日`;
    }
}