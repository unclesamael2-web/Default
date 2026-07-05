"""Symbolically solve a real quartic whose coefficients are parameterized
by its own (real) roots via Vieta's formulas.

The monic quartic with roots r1, r2, r3, r4 (ordering unspecified) is

    p(x) = x^4 - e1*x^3 + e2*x^2 - e3*x + e4

where e1..e4 are the elementary symmetric polynomials of the roots:

    e1 = r1 + r2 + r3 + r4
    e2 = r1*r2 + r1*r3 + r1*r4 + r2*r3 + r2*r4 + r3*r4
    e3 = r1*r2*r3 + r1*r2*r4 + r1*r3*r4 + r2*r3*r4
    e4 = r1*r2*r3*r4

We hand sympy only the *expanded* polynomial in x (coefficients as symmetric
expressions in r1..r4) and ask it to solve symbolically.
"""

import sympy as sp

x = sp.symbols("x")
r1, r2, r3, r4 = roots = sp.symbols("r1 r2 r3 r4", real=True)


def vieta_coefficients(roots):
    """Elementary symmetric polynomials e1..e4 of the given roots."""
    r1, r2, r3, r4 = roots
    e1 = r1 + r2 + r3 + r4
    e2 = r1*r2 + r1*r3 + r1*r4 + r2*r3 + r2*r4 + r3*r4
    e3 = r1*r2*r3 + r1*r2*r4 + r1*r3*r4 + r2*r3*r4
    e4 = r1*r2*r3*r4
    return e1, e2, e3, e4


def build_quartic(roots):
    """Monic quartic in x with the Vieta-parameterized coefficients.

    Built directly from e1..e4 (NOT from the factored form), so sympy
    receives it exactly as a coefficient-parameterized polynomial.
    """
    e1, e2, e3, e4 = vieta_coefficients(roots)
    return sp.expand(x**4 - e1*x**3 + e2*x**2 - e3*x + e4)


def main():
    p = build_quartic(roots)
    e1, e2, e3, e4 = vieta_coefficients(roots)

    print("Quartic:  x^4 - e1*x^3 + e2*x^2 - e3*x + e4 = 0, with")
    for name, e in zip(("e1", "e2", "e3", "e4"), (e1, e2, e3, e4)):
        print(f"  {name} = {e}")
    print()

    # Symbolic solve of the expanded polynomial
    sols = sp.solve(sp.Eq(p, 0), x)
    print("solve() returns:")
    for s in sols:
        print("  x =", sp.simplify(s))
    print()

    # Same via factorization over QQ(r1..r4)
    print("factor() returns:")
    print(" ", sp.factor(p, deep=True))
    print()

    # Verify: solution set == root set (as sets, ordering unspecified)
    assert set(sols) == set(roots), f"mismatch: {sols}"
    print("Verified: solution set == {r1, r2, r3, r4} (order unspecified).")

    # Sanity check with a repeated root (r3 = r4): multiplicity handling
    rep = (r1, r2, r3, r3)
    p_rep = build_quartic(rep)
    rts = sp.roots(sp.Poly(p_rep, x))
    print("\nRepeated-root case (r4 -> r3), roots with multiplicity:")
    for root, mult in rts.items():
        print(f"  x = {root}  (multiplicity {mult})")


if __name__ == "__main__":
    main()
