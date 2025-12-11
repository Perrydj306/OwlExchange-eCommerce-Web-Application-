OwlExchange Launch Instructions:
1. In the /c/Source/OwlExchange-eCommerce-Web-Application-/server path: Type node index.js
2. In the /c/Source/OwlExchange-eCommerce-Web-Application-/src path: Type npm run dev
3. Make sure that you connect to server first

Test Login Account Information:

  User
  
    Email: jdoe@gmail.com
  
    Password: Testpassword@1

  Admin
  
    Email: glong@owladmin.com
  
    Password: Testpassword@2

To get the Database Connected:

1. Restore the Database on the New Server
   
On the new SQL Server:

-Open SSMS

-Right-click Databases → Restore Database

Choose:

-Source: Device → browse for the .bak file (the db.bak file is attached)

Set the destination name to:
OwlExchangeDB

Click OK

Database is now restored on the new server.

2. Create a SQL Login on the New Server
   
To allow the backend to connect:

In SSMS, expand Security → Logins

Right-click → New Login

Set:

-Login name: owlexchange

-Password: !owl!

-Default database: OwlExchangeDB

Under User Mapping, check:

OwlExchangeDB → db_owner

Click OK.

3. Update the .env File on the Backend
   
If the new server has a different IP or DNS name, update .env:

"DB_SERVER=NEW_SERVER_IP_OR_DNS"

Everything else can stay the same unless you changed the username/password.

4. Ensure Firewall + SQL Settings Allow Remote Connections
   
On the new server:

Enable TCP/IP in SQL Server Configuration Manager

Allow port 1433 through Windows Firewall
If using a domain like DynDNS or No-IP, update the hostname
