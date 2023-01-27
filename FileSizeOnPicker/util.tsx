export function convertBytes(bytes) {
    if (bytes < 1024) {
        return bytes + " bytes";
    } else if (bytes < 1024*1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024*1024*1024) {
        return (bytes / 1024*1024).toFixed(2) + " MB";
    } else {
        return (bytes / 1024*1024*1024).toFixed(2) + " GB";
    }
}
export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}