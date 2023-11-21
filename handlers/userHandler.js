import { User, users } from "../models/userModel.js"; 
import bcrypt from 'bcrypt'
import crypto from 'crypto';

function _resolveId() {
    if(users?.length < 0) {
        return null;
    }
    return users.length + 1;
}

function _excludeProperties(obj, excludedProps) {
    debugger;
    const { [excludedProps]: _, ...result } = obj;
    return result;
  }

async function _generatePassword(password) {
    debugger;
    return await bcrypt.hash(password, 10);
}

async function _comparePasswords(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword); 
}

async function generateHash() {
    debugger;
    const randomData = crypto.randomBytes(32);
    const hash = crypto.createHash('sha256');
    hash.update(randomData);
    return hash.digest('hex');
}

async function createUser(name, email, password) {
    const hashPassword = await _generatePassword(password);
    const user = new User(_resolveId(), name, email, hashPassword);
    users.push(user);
    return _excludeProperties(user, 'password');
}

async function checkCredentials(email, password) {
    const user = users.find(user => user.email === email);
    if(!user) {
        return null;
    }
    return _comparePasswords(password, user.password) ? _excludeProperties(user, 'password') : null; 
}

function getUserProfile(id) {
    return users.find(x => x.id == id);
}

export const methods = {
    createUser,
    checkCredentials,
    getUserProfile,
    generateHash
}