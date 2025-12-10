import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { nanoid } from 'nanoid'
import { existsSync, mkdirSync } from 'fs'

let db = null

const defaultData = {
  users: [],
  roles: [],
  deletedEmails: [], 
  permissions: []
}

async function getDB() {
  if (db) return db

  const folder = join(process.cwd(), 'data')
  if (!existsSync(folder)) mkdirSync(folder)

  const file = join(folder, 'db.json')
  const adapter = new JSONFile(file)
  db = new Low(adapter, defaultData)

  await db.read()

  db.data ||= {}
  db.data.users ||= []
  db.data.roles ||= []
  db.data.permissions ||= []
  db.data.deletedEmails ||= []

  if (db.data.roles.length === 0) {
    db.data.roles = [
      {
        id: 'admin',
        name: 'Admin',
        permissions: [
          'manage_users',
          'view_admin',
          'edit_content',
          'delete_content'
        ]
      },
      {
        id: 'editor',
        name: 'Editor',
        permissions: ['edit_content', 'view_editor']
      },
      {
        id: 'viewer',
        name: 'Viewer',
        permissions: ['view_content','edit_content',]
      }
    ]
    await db.write()
  }

  return db
}



export async function upsertUser({ email, name, image, provider, providerAccountId, role }) {
  const db = await getDB();

  const deletedIndex = db.data.deletedEmails.indexOf(email);
  if (deletedIndex !== -1) {
    db.data.deletedEmails.splice(deletedIndex, 1);
  }

  let user = db.data.users.find(u => u.email === email);

  if (!user) {
    user = {
      id: nanoid(),
      email,
      name,
      image,
      roles: Array.isArray(role) ? role : [role || 'admin'],
      accounts: [{ provider, providerAccountId }],
      createdAt: new Date().toISOString()
    };
    db.data.users.push(user);
  } else {
    user.name = name || user.name;
    user.image = image || user.image;

    const linked = user.accounts.find(a => a.provider === provider && a.providerAccountId === providerAccountId);
    if (!linked) {
      user.accounts.push({ provider, providerAccountId });
    }

    user.roles = Array.isArray(role) ? role : [role || 'admin'];
  }

  await db.write();
  return user;
}

export async function findUserByEmail(email) {
  const db = await getDB()
  return db.data.users.find(u => u.email === email)
}

export async function listUsers() {
  const db = await getDB()
  return db.data.users
}

export async function setUserRole(userId, roles) {
  const db = await getDB()

  const user = db.data.users.find(u => u.id == userId)
  if (!user) throw new Error('User not found')

  user.roles = Array.isArray(roles) ? roles : [roles]
  await db.write()
  return user
}

export async function deleteUser(userId) {
  const db = await getDB();

  const index = db.data.users.findIndex(u => u.id == userId);
  if (index === -1) throw new Error("User not found");

  const userEmail = db.data.users[index].email;

  if (!db.data.deletedEmails.includes(userEmail)) {
    db.data.deletedEmails.push(userEmail);
  }

  db.data.users.splice(index, 1);

  await db.write();
  return true;
}