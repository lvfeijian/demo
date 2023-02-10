// 创建一个a标签，并做点击下载事件
function downloadFile(hrefUrl, fileName){
    let a = document.createElement('a')
    a.href = hrefUrl
    a.download = fileName // 下载后文件名
    document.body.appendChild(a)
    a.click() // 点击下载
    document.body.removeChild(a) // 下载完成移除元素
}
// 封装blob对象
function dataURLToBlob(base64Str, mimeTypeStr) {
    let bstr = window.atob(base64Str); // 解码 base-64 编码的字符串，base-64 编码使用方法是 btoa()
    let length = bstr.length;
    let u8arr = new Uint8Array(length); // 创建初始化为0的，包含length个元素的无符号整型数组
    while (length--) {
        u8arr[length] = bstr.charCodeAt(length); // 返回在指定的位置的字符的 Unicode 编码
    }
    return new Blob([u8arr], { type: mimeTypeStr }); // 返回一个blob对象
}

// 后端返回base64公共导出
function downloadFileByBase64(base64Str, mimeTypeStr, fileName){
    let myBlob = dataURLToBlob(base64Str, mimeTypeStr)
    let myUrl = window.URL.createObjectURL(myBlob)
    downloadFile(myUrl, fileName)
}
// 后端返回文件流公共导出
function downloadFileByFileFlow(blobData, mimeTypeStr, fileName) {
    let blob = new Blob([blobData], { type: mimeTypeStr })
    let hrefUrl = window.URL.createObjectURL(blob) // 创建下载的链接
    downloadFile(hrefUrl, fileName);
}