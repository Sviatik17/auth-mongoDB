const User =require('./models/user');
const Role =require('./models/role');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {secret}=require('./config');

const generateAccessToken=(id,roles)=>{
    const payload={
        id,
        roles
    };

    return jwt.sign(payload,secret,{expiresIn:'24h'})
}


class authController {
    async registration(req,res){
        try{
            const {username,password}=req.body;
            const candidate = await User.findOne({username});
            if(candidate){
                return res.status(400).json({message:'user already exists'});
            }
            let hashPassword=bcrypt.hashSync(password,7);
            const  userRole=await Role.findOne({value:"USER"})
            const user = new User({username,password:hashPassword,roles:[userRole.value]})
            await user.save();
            return res.json('registration successful');


        }catch(e){
            console.log(e);
            res.status(400).json({message:'Registration error'});

        }
    }
    async login(req,res){
        try{
            const {username,password}=req.body;
            const user = await User.findOne({username});
            if(!user){
                return res.status(400).json({message:`Користувач ${username} не знайдений`})
            }
            const validPassword=bcrypt.compareSync(password,user.password);
            if(!validPassword){
                return res.status(400).json({message:`Пароль невірний`})
            }
            const token = generateAccessToken(user._id,user.roles);
            return res.json({token})


        }catch(e){
            console.log(e);
            res.status(400).json({message:'login error'})
            
        }
    }
    async getUsers(req,res){
        try{
            const userRole = new Role();
            const adminRole = new Role({value:'ADMIN'});
            await userRole.save();
            await adminRole.save();
            res.json('server work');
        }catch(e){
            
        }
    }
}
module.exports=new authController()