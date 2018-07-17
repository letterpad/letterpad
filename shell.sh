echo "============================"
echo "== Letterpad Installation =="
echo "============================"



function createNewUser {
    read -p "Enter new user name: " answer
    user=$answer
    read -p "Enter a password for the new user: " answer
    password=$answer
    if [ $(id -u $user) ] ; then
        echo Error: user $user exists
    else
        echo "Creating user ${user}.."
        # quietly add a user without password
        adduser --quiet --disabled-password --shell /bin/bash --home /home/$user --gecos "User" $user
        # set password
        echo "${user}:${password}" | chpasswd
        echo "User created. Assigning groups"
        gpasswd -a $user sudo
        gpasswd -a $user www-data     
    fi

}

function installSystemUpdates {
    sudo apt-get update && sudo apt-get upgrade -y > /dev/null 
    echo "[1/7]Installing system updates"
}

function getVersion {
    lib=$1
    # does the library exist ?
    if ! [ -x "$(command -v $lib)" ]; then
        echo 0;
        return;
    fi
    # get the argument (v1.1.0) and stip the first alphabet
    if [ $lib ] ; then
        majorVersion=$($lib -v | awk -F \. {'print $1'})
        echo ${majorVersion:1}
        return;
    fi
}

function installNode {
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs > /dev/null
    echo [2/7]Installing NodeJS..
}

## STEP - 1 [USER CREATION] 
read -p "Would you like to create a new user ? Enter to proceed with ${USER} (y/n)? " answer
case ${answer:0:1} in
    y|Y )
        createNewUser
    ;;
    * )
        echo No
    ;;
esac

## STEP - 2 [INSTALL SYSTEM UPDATES]
installSystemUpdates

## STEP - 3 [INSTALL NODE IF NOT EXIST]
nodeV=$(getVersion node)
if [ "$nodeV" -lt "8" ] ; then
    installNode
fi

## STEP - 4 [INSTALL YARN]
echo "[3/7]Checking yarn"
sudo curl -o- -L https://yarnpkg.com/install.sh | bash > /dev/null

## STEP - 5 [INSTALL LETTERPAD]
echo Stepping into /var/www
cd /var/www
echo [4/7]Cloning Letterpad...
sudo rm -rf /var/www/letterpad
sudo git clone https://github.com/letterpad/letterpad.git
echo "Assigning user ($USER) permissions to /var/www/letterpad"
sudo chown -R $USER:www-data /var/www/letterpad
cd letterpad
echo Writing .env file
cp sample.env .env

## STEP - 6 [INSTALL LETTERPAD DEPENDENCIES]
echo [5/7]Installing dependencies..
yarn install

## STEP - 7 [Edit .env file and update the urls]
read -p "Enter the IP of your server: " answer
sed -i -e "s/localhost:3030/${answer}/g" ./.env
sed -i -e "s/localhost:4040/${answer}/g" ./.env
echo [6/7] Replaced IP in .env file
## STEP - 7 [BUILD LETTERPAD]
echo "[7/7]   Building Letterpad"
theme=hugo yarn build

## STEP - 8 [Run]
yarn prod


















# list all users: cut -d: -f1 /etc/passwd
# delete user 