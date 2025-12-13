import instance from "@/lib/axios/instance";


const uploadService = {
    upload: async(file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return instance.post("/media/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    },
    delete: async(fileUrl: string) => {
        return instance.delete("/media/delete", {
            data: { 
                fileUrl: fileUrl 
            } 
        });
    }
}

export default uploadService;