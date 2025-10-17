import mogoose from "mongoose";
export const DBConnection = async () => {
    return await mogoose.connect(process.env.LOCAL_DATA_BASE_URL)
        .then(() => {
        console.log("Database connected sucessfully");
    })
        .catch(err => {
        console.log("DB Error=>", err);
    });
};
