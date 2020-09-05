import {promises as fs} from "fs";

const responseHandler = async (req, res, next) => {
    const data = await fs.readFile('my-page.html', 'utf8');
    res.send(data);
}

export default respo