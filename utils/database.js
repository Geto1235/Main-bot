import fs from 'fs';
const dbPath = './database/storage.json';
const defaultData = {
  botName: 'geto',
  ownerNumber: '201002328470',
  prefix: '.' };
export const loadDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2)); }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8')); };
export const saveDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); };
export const getDatabase = () => {
  return loadDatabase(); };
export const updateDatabase = (key, value) => {
  const data = loadDatabase();
  data[key] = value;
  saveDatabase(data); };
