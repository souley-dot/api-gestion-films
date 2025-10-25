module.exports={
    myUser: process.env.MYSQL_USER || 'root',
    myHost: process.env.MYSQL_HOST|| 'localhost',
    myPassword: process.env.MYSQL_PASSWORD || '',
    myDatabase: process.env.MYSQL_DATABASE || 'devoirapi',
    myPort: process.env.MYSQL_PORT || 3306
}



