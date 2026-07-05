"""Does adding absolute values to the radical toolkit sidestep Abel-Ruffini
for the quintic?  (Motivation: |.| is non-analytic, and it genuinely helped
in the quartic, collapsing every +/- branch into a single-valued formula.)

Answer: no -- and for TWO independent reasons, verified below.

(1) The field-theoretic reason (the "|x| = sqrt(x^2)" realization, sharpened).
    It is even worse than |.| being re-expressible as a radical: |.| never
    produces a NEW number at all.  For any real quantity E already
    constructed, |E| is either E or -E -- both already in your field.
    X^2 - E^2 factors as (X - E)(X + E): adjoining |E| is adjoining a root
    of a REDUCIBLE polynomial, i.e. adjoining nothing.  A "radicals + abs"
    tower is field-for-field identical to a radical tower, so Abel-Ruffini
    applies verbatim: quintics with Galois group S5 exist, S5 is not
    solvable, done.  Crucially, this includes quintics with ALL ROOTS REAL
    (a hyperbolic S5 quintic is exhibited and its group computed).

(2) The structural reason (why the quartic trick has no degree-5 analog).
    In the quartic, |.| had something to act on: the pair-sums
    s_k = r_i + r_j - r_k - r_l, whose SQUARES form a 3-element orbit under
    S4 -- small enough to be the roots of a resolvent CUBIC in the
    coefficients.  The whole method is the subgroup chain
        S4 > A4 > V > 1     (quotients Z/2, Z/3, Z/2 x Z/2),
    where |.| resolves each Z/2 layer and cos/arccos the Z/3 layer.
    For n = 5 the chain is
        S5 > A5 > 1,
    and A5 is SIMPLE: after the single sign layer sqrt(disc) -> |Vandermonde|
    there are no intermediate layers left -- no analog of the s_k, no
    resolvent of degree < 5 (verified by orbit counting below).  There is
    no ladder for |.| to climb.

What the non-analyticity intuition WAS pointing at: Arnold's topological
proof of Abel-Ruffini.  Over C, any formula composed of radicals and
arbitrary single-valued continuous functions (|.| qualifies) has SOLVABLE
monodromy; the quintic root function has monodromy S5, not solvable.  So
the theorem is already robust against every single-valued continuous
gadget, not just analytic ones.  Khovanskii's topological Galois theory
pushes further: elementary functions and even quadratures (integration)
don't suffice.  Escaping genuinely requires a new multivalued special
function -- the Bring radical (root of t^5 + t = a), or Hermite's elliptic
modular functions.
"""

import itertools
from math import comb

import sympy as sp

x, X = sp.symbols("x X")


def hr(title):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


# ----------------------------------------------------------------------
hr("1a. |.| never enlarges the field: adjoining |E| adjoins a root of a"
   "\n     REDUCIBLE polynomial")

E = sp.symbols("E", real=True)
print("candidate minimal polynomial of |E| over Q(E):  X^2 - E^2")
print("factors as:", sp.factor(X**2 - E**2))
print("=> |E| in {E, -E}, already present.  radicals+abs towers = radical")
print("   towers, so Abel-Ruffini applies to them unchanged.")

# ----------------------------------------------------------------------
hr("1b. An ALL-REAL-ROOTS quintic with Galois group S5")

p = sp.Poly(x**5 - 5*x**3 + 4*x - 1, x)
assert sp.factor_list(p.as_expr())[1][0][1] == 1 and \
    len(sp.factor_list(p.as_expr())[1]) == 1          # irreducible over Q
real = sp.real_roots(p.as_expr())
assert len(real) == 5 and len(set(real)) == 5
print("p(x) = x^5 - 5x^3 + 4x - 1   (irreducible over Q)")
print("roots (all real, distinct):",
      [str(r.evalf(6)) for r in real])

from sympy.polys.numberfields.galoisgroups import galois_group
G, in_alternating = galois_group(p)
assert G.order() == 120 and not in_alternating
print(f"Galois group: order {G.order()}, inside A5: {in_alternating}"
      "  =>  full S5")
print("S5 composition series: S5 > A5 > 1, and A5 is simple non-abelian:")
print("not solvable.  Its roots -- though all real -- lie in NO radical")
print("tower, hence in no radicals+abs tower.  Realness of the roots does")
print("not soften Abel-Ruffini (it did not for the cubic either: casus")
print("irreducibilis was the same phenomenon one floor down).")

# ----------------------------------------------------------------------
hr("2. Why the quartic construction has no degree-5 analog: orbit counting")

# The quartic's |.|-formula fed on the squared pair-sums (s_k)^2, whose
# S4-orbit has size 3 -- the roots of the resolvent cubic.  Look for the
# analogous raw material at n = 5: signed linear forms eps . r with
# eps in {+1,-1}^n, taken up to overall sign (since we would only ever
# reach them through their squares).
for n in (4, 5):
    print(f"n = {n}:")
    for k in range(1, n // 2 + 1):
        orbit = comb(n, k) if 2*k != n else comb(n, k) // 2
        marker = "  <-- resolvent CUBIC: the quartic's s_k" \
            if (n, orbit) == (4, 3) else ""
        print(f"  sign pattern with {k} minus(es): orbit size of the "
              f"squared form under S{n} = {orbit}{marker}")
print()
print("At n = 4 the balanced pattern (2 minuses) gives an orbit of size 3:")
print("a polynomial of degree 3 < 4 in the coefficients -- progress.")
print("At n = 5 every orbit has size 5 or 10: never SMALLER than the")
print("problem we started with.  This is no accident: S5 has no subgroup")
print("of index 2, 3, or 4 except A5 (index 2), so no resolvent of degree")
print("< 5 exists at all.  After |Vandermonde| absorbs the single sqrt(disc)")
print("sign layer (S5 -> A5), the simplicity of A5 leaves nothing between")
print("the coefficients and the roots for |.| -- or cos/arccos -- to grab.")

# Verify the group-theoretic core computationally:
from sympy.combinatorics import SymmetricGroup
S4g, S5g = SymmetricGroup(4), SymmetricGroup(5)
assert S4g.is_solvable and not S5g.is_solvable
series_orders = [H.order() for H in S5g.composition_series()]
assert series_orders == [120, 60, 1], series_orders
print("\n[verified: S4 solvable; S5 not solvable, composition series has")
print(" orders 120 > 60 > 1 -- one sign layer, then the simple A5 wall.")
print(" (No index-3 or -4 subgroup exists either: the coset action would")
print(" give a map S5 -> S3 or S4 whose kernel must be one of S5's only")
print(" normal subgroups {1, A5, S5}, and none has the right size.)]")

# ----------------------------------------------------------------------
hr("3. Scorecard: which toolkits solve the general (even all-real) quintic")

print("""  radicals                          NO   (Abel-Ruffini / Galois)
  radicals + |.|                    NO   (|.| adds no numbers: section 1)
  + any single-valued continuous
    functions composed with them    NO   (Arnold: monodromy of any such
                                          formula is solvable; quintic
                                          root monodromy is S5)
  + elementary functions (exp, log,
    trig -- the quartic's arccos!)  NO   (Khovanskii, topological Galois
                                          theory; the cubic/quartic trig
                                          escape works only because Z/3 has
                                          solvable monodromy)
  + quadratures (integration)       NO   (Khovanskii)
  + Bring radical  t^5 + t = a      YES  (after Tschirnhaus reduction)
  + elliptic modular functions      YES  (Hermite 1858)""")
