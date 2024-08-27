export const isSqliteDb = () => {
  return process.env.DATABASE_URL?.startsWith("file");
};

export const isPostgresDb = () => {
  return process.env.DATABASE_URL?.includes("postgres");
};


export const isValidEmail = (email: string) => {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
