(async () => {
    const fs = require('fs');
    const alfy = require('alfy');
    const axios = require('axios');
    const uuiddash = require('add-dashes-to-uuid');

    const data = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${process.argv[2]}`);

    if(data.status == 200) {
        const path = `./heads/${data.data.id}_96.png`;
        if(!fs.existsSync(path) || 3600000 < new Date().getTime() - fs.statSync(path).mtime) {
            const writer = fs.createWriteStream(path);
            const response = await axios({
                url: `https://minotar.net/avatar/${data.data.id}/96.png`,
                method: 'GET',
                responseType: 'stream'
            })
            response.data.pipe(writer);
        }

        const getResult = (dash) => {
            const uuid = dash ? uuiddash(data.data.id) : data.data.id;
            return {
                uid: uuid,
                title: data.data.name,
                subtitle: uuid,
                arg: data.data.name,
                icon: {
                    type: 'icon',
                    path: `${process.cwd()}/heads/${data.data.id}_96.png`
                },
                text: {
                    copy: uuid
                }
            }
        };

        alfy.output([
            getResult(true),
            getResult()
        ]);
    } else {
        alfy.output([{
            title: 'Not found',
            subtitle: `${process.argv[2]} is not found.`,
            icon: {
                type: 'icon',
                path: alfy.icon.error
            }
        }]);
    }
})()