export const parseString = (str: string) => Function('"use strict";return (' + str + ")")()
