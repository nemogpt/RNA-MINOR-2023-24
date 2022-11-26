import faker
import random
from faker.providers import bank, credit_card, geo, address, person, company
import psycopg2

fakerObj = faker.Faker()
fakerObj.add_provider(bank)
fakerObj.add_provider(credit_card)
fakerObj.add_provider(geo)
fakerObj.add_provider(address)
fakerObj.add_provider(person)
fakerObj.add_provider(company)

db_connection = psycopg2.connect(
    database="minor", user="minor", password="dev", host="localhost", port=5432)

db_cursor = db_connection.cursor()


def create_branch_details():
    ifsc = fakerObj.swift()
    name = fakerObj.company()
    addr = fakerObj.address()
    obj = {'branch_id': ifsc, 'branch_name': name, 'branch_address': addr}
    return obj


def create_customer():
    customer_id = random.randint(1000000000, 9999999999)
    account_no = fakerObj.bban()
    full_name = f"{fakerObj.first_name()} {fakerObj.last_name()}"
    balance = random.randint(0, 100000)
    ac_type = random.randint(0, 2)
    branch = random.choice(branches)['branch_id']
    obj = {'customer_id': customer_id, 'account_no': account_no,
           'name': full_name, 'balance': balance, 'ac_type': ac_type, 'home_branch': branch}
    # print(obj)
    return obj


def create_cards(customers: list):
    if len(customers) == 0:
        return
    while len(customers) > 0:
        card_no = fakerObj.credit_card_number()
        card_type = random.randint(0, 1)
        pin = random.randint(0000, 9999)
        cvv = fakerObj.credit_card_security_code()
        exp_date = fakerObj.credit_card_expire()
        txn_limit = None
        credit_limit = None
        if card_type == 1:
            credit_limit = random.randint(0, 300000)
        else:
            txn_limit = random.randint(0, 100000)
        ac_no_c = random.choice(customers)
        customers.remove(ac_no_c)
        ac_no = ac_no_c['account_no']

        obj = {
            'card_no': card_no,
            'card_type': card_type,
            'pin': pin,
            'cvv': cvv,
            'exp_date': exp_date,
            'txn_limit': txn_limit,
            'credit_limit': credit_limit,
            'ac_no': ac_no
        }

        cards.append(obj)


def create_atms(branches: list):
    if len(branches) == 0:
        return
    while len(branches) > 0:
        atm_id = random.randint(10000000, 99999999)
        atm_address = fakerObj.address()
        atm_branch_c = random.choice(branches)
        atm_branch = atm_branch_c['branch_id']
        branches.remove(atm_branch_c)
        location = list(fakerObj.local_latlng(country_code="IN", coords_only=True))
        location = [float(i) for i in location]
        location = tuple(location)
        balance = random.randint(0, 9999999)
        
        obj = {'atm_id': atm_id, 'atm_address': atm_address,
               'atm_branch': atm_branch, 'location': location, 'balance': balance}
        # print(obj)
        atms.append(obj)


branches = []
atms = []
customers = []
cards = []
for _ in range(30):
    branches.append(create_branch_details())

for _ in range(10000):
    customers.append(create_customer())

def prepare_insert_sql(data: dict, tbl_name: str = "tbl"):
    stmt = f'INSERT INTO {tbl_name}(' 
    for col in data.keys():
        stmt += str(col) + ','
    stmt = stmt[:len(stmt) - 1]
    stmt += ') VALUES ('
    for val in data.values():
        if (val is None):
            stmt += 'NULL, '
        elif (type(val) == type('1')):
            stmt += '\''+ str(val) + '\'' + ', '
        else:
            stmt += str(val) + ', '
    stmt = stmt[:len(stmt)-2]
    stmt += ')'
    print(stmt)
    return stmt
    

create_cards(customers)
create_atms(branches)
# print(customers)
# print(cards)
# print(branches)
# print(atms)

for branch in branches:
    stmt = prepare_insert_sql(branch, 'branch')
    db_cursor.execute(stmt)
print("Branches Done")
# for atm in atms:
#     stmt = prepare_insert_sql(atm, 'ATM')
#     db_cursor.execute(stmt)

for customer in customers:
    stmt =  prepare_insert_sql(customer, 'customer')
    db_cursor.execute(stmt)
print("Customers Done")
# for card in cards:
#     stmt = prepare_insert_sql(card, 'card')
#     db_cursor.execute(stmt)

db_connection.commit()
db_connection.close()