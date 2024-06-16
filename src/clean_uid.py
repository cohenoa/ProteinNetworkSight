delete_after = ['-P', '_P','_', '_CLEAVED', '-CLEAVED',
                '_CLONE', '-CLONE', '_ACTIVE', '-ACTIVE']
remove = ['_', '-', ']', '[', '\'', 'ALPHA']


def clean_id(id, delete_after=delete_after, remove=remove, complex_sub="COMPLEX", delim="_"):
    """Parse single id to make it readable for automation.
    Args:
        id (string): [description].
        delete_after ([string], optional): [description].
        remove ([string], optional): [description]. 
    Returns:
        new id string.
    """
    # move to uppercases letters
    id = str(id).upper()
    if not id:
        return ""

    # special case = complex protein
    if str(complex_sub) in id:
        return complex_rom_num(id, complex_sub, delim)

    # delete all chars that appear after the chars in the to_delete array (included)
    new_id = id
    for d in delete_after:
        new_id = new_id.partition(d)[0]

    # remove the chars that in the remove array
    for c in remove:
        new_id = new_id.replace(c, " ")

    return new_id


def complex_rom_num(comp, complex_sub, delim):
    """Finds the roman numeral of a complex protein.
    Args:
        comp ([type]): [description]
    Returns:
        [type]: [description]
    """
    rom_start_idx = comp.find(complex_sub) + len(complex_sub) + len(delim)

    rom_end_idx = comp.find(delim, rom_start_idx)

    return complex_sub + " " + comp[rom_start_idx: rom_end_idx]
