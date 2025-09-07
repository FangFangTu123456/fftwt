import React from 'react';

const FileItem = ({ icon, name, dateModified, type, size }) => (
    <div className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-blue-100/50 rounded-md text-sm">
        <div className="col-span-5 flex items-center">
            <span className="mr-3 text-xl">{icon}</span>
            <span>{name}</span>
        </div>
        <div className="col-span-3 text-gray-600">{dateModified}</div>
        <div className="col-span-2 text-gray-600">{type}</div>
        <div className="col-span-2 text-gray-600 text-right">{size}</div>
    </div>
);

const FileExplorer = () => {
    return (
        <div className="w-full h-full bg-white flex flex-col">
            <div className="p-2 border-b">
                <h2 className="text-lg font-semibold">快速访问</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="font-semibold text-gray-500 text-xs uppercase">
                     <div className="grid grid-cols-12 gap-4 p-2">
                        <div className="col-span-5">名称</div>
                        <div className="col-span-3">修改日期</div>
                        <div className="col-span-2">类型</div>
                        <div className="col-span-2 text-right">大小</div>
                    </div>
                </div>
                <div>
                    <FileItem icon="📁" name="文档" dateModified="2024/07/20 10:30" type="文件夹" size="" />
                    <FileItem icon="📁" name="下载" dateModified="2024/07/20 11:15" type="文件夹" size="" />
                    <FileItem icon="📁" name="图片" dateModified="2024/07/19 18:45" type="文件夹" size="" />
                    <FileItem icon="📄" name="项目简介.docx" dateModified="2024/07/18 09:00" type="Microsoft Word 文档" size="256 KB" />
                    <FileItem icon="📊" name="季度报告.xlsx" dateModified="2024/07/17 14:20" type="Microsoft Excel 工作表" size="1.2 MB" />
                    <FileItem icon="🖼️" name="度假照片.jpg" dateModified="2024/07/15 20:05" type="JPG 文件" size="4.8 MB" />
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;