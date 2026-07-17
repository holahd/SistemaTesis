# Web System for Fire Safety Products and Fire Extinguisher Expiration Control - PREVENCO

This web system was developed as a degree project to obtain the title of Higher Technologist in Software Development at the "17 de Julio" Superior Technological Institute. The platform takes the company PREVENCO (Ibarra, Ecuador) as a scenario in order to digitalize, centralize, and optimize its inventory and sales flows.

---

## The Real Problem
PREVENCO coordinated its inventory and sales areas using traditional spreadsheets. This caused disorder in the information, typing errors, duplicate records, a lack of real-time stock synchronization, and risks of losing historical data. Likewise, it complicated the rigorous tracking of maintenance and expiration dates for fire extinguisher batches and safety equipment.

## The Solution
The system centralizes operational tasks into a single web platform, allowing fluid communication between the inventory manager and the sales manager. The software does not manage payment gateways or shipping logistics; it focuses strictly on the automation of the public catalog, advanced batch stock management, and a controlled flow of dynamic quotes.

---

## Tech Stack
* **Backend:** PHP (Custom structured development to optimize local server performance).
* **Frontend:** HTML5, CSS3, JavaScript, jQuery, and the Bootstrap framework.
* **Database:** MySQL (Entity-Relationship model optimized for data consistency).
* **Deployment Server:** Internet Information Services (IIS) in a localhost environment.
* **Development Methodology:** Extreme Programming (XP), working through iterations based on user stories.

---

## Key Modules and Features

### 1. Advanced Inventory Management (By Batches and Dynamic Categories)
* **Dynamic Attributes:** The product registration form adapts its fields according to the selected category (e.g., weight/capacity for fire extinguishers versus sizes for safety clothing).
* **Batch Control:** Meticulous registration of entries, supplier origin, unit cost, and entry dates.
* **Expiration Tracking:** Specific control for perishable products or fire extinguishers that require periodic maintenance.
* **Secure History:** Option to "discontinue" products to preserve the integrity of historical sales data without deleting them from the database.

### 2. Automated Quote and Sales Flow
* **Public Catalog:** Clean user interface with search bars and filters by category/subcategory that reads directly from the actual available stock.
* **Online Requests:** Customers structure their order and send the request by entering only their email address and phone number.
* **Automated Suggested Prices:** The system automatically calculates a suggested retail price based on the profit margin percentage configured by the Administrator.
* **Automatic Volume Discounts:** Application of dynamic business rules (e.g., automatic percentage reduction if the order exceeds a certain threshold of units).
* **Cycle Closure:** The sales manager processes the request, adjusts values if necessary, and sends an attached PDF via email. Once the purchase is confirmed externally, it is validated in the system and the stock is automatically deducted from the inventory.

### 3. Security and Business Rules Configuration
* **Restricted Access Roles:** Strict separation of functions in the backend for the Administrator, Sales Manager, and Inventory Manager.
* **Mandatory Redirection:** The system detects new accounts or passwords reset by the administrator, forcing the user to change their credentials upon their first login.
* **Notification Module:** Role-segmented visual alerts regarding low stock, pending quotes for review, and batches close to expiring.

---

## System Preview

| Public Catalog Interface | Central Administration Panel |
|---|---|
| ![Catalog](screenshots/catalogo_general.jpg) | ![Admin Panel](screenshots/panel_administrador.jpg) |

| Product Interface | Quote Preview |
|---|---|
| ![Product Description](screenshots/descripcion_producto.jpg) | ![Quote Request](screenshots/solicitud_cotizacion.jpg) |

| Profit Margin Configuration Panel | Product Management Preview |
|---|---|
| ![Margin Configuration](screenshots/panel_configuracion_margen_ganancia.jpg) | ![Product Management](screenshots/gestion_productos.jpg) |

---
**Author:** Xavier Alfredo Vera Guerra  
**Institution:** Instituto Superior Tecnológico "17 de Julio"  
**Year of Completion:** 2025
