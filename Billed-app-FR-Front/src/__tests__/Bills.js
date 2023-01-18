/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import BaseDeDonnees from "../__mocks__/BaseDeDonnees.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy();
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills }, {formatDate: false})
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then the bill should appear on the screen", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const windowIcon = screen.getAllByTestId('icon-eye')

      windowIcon.forEach(eye => {
        const fileName = jest.fn(bills.fileName)          
        eye.addEventListener('click', fileName)
        expect(document.getElementById("modaleFile").style.display = "block").toBeTruthy()
      });
    })


    describe('When I click on the icon eye', () => {
      test('A modal should open', () => {
        const html = BillsUI({
          data: bills
        });
        document.body.innerHTML = html;
        const firestore = null;
        const allBills = new Bills({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });

        $.fn.modal = jest.fn();
        const eye = screen.getAllByTestId('icon-eye')[0];
        const handleClickIconEye = jest.fn(() =>
          allBills.handleClickIconEye(eye)
        );
        eye.addEventListener('click', handleClickIconEye);
        fireEvent.click(eye);

        // La fonction handleClickIconEye doit être appelée
        expect(handleClickIconEye).toHaveBeenCalled();
        const modale = document.getElementById('modaleFile');
        // La facture doit apparaitre
        expect(modale).toBeTruthy();
      });
    });
  })


  describe('Given I am connected as Employee and I am on Bills page', () => {
    describe('When I click on the New Bill button', () => {
      test('Then, it should render NewBill page', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname
          });
        };
        const html = BillsUI({
          data: []
        });
        document.body.innerHTML = html;
        const firestore = null;
        const allBills = new Bills({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });
        const handleClickNewBill = jest.fn(allBills.handleClickNewBill);
        const billBtn = screen.getByTestId('btn-new-bill');

        billBtn.addEventListener('click', handleClickNewBill);
        fireEvent.click(billBtn);
        // L'écran devrait afficher "Envoyer une note de frais"
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
      });
    });
  });
//---------------------------------------------------------------------------------------------------------------------------//
})


// test d'intégration GET Bills
describe("Given I am a user connected as Employee", () => {
  describe("Quand je suis dans Bills UI", () => {
    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js", async () => {
      const getFactures = jest.spyOn(BaseDeDonnees, "get");
      const bills = await BaseDeDonnees.get();
      expect(getFactures).toHaveBeenCalledTimes(1);
      // Le nombre de factures doit être 4
      expect(bills.data.length).toBe(4);
    });

    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js échec avec message d'erreur 404", async () => {
      BaseDeDonnees.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );

      // Création du code erreur 404
      const html = BillsUI({
        error: "Erreur 404"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);
      // Test de l'erreur 404
      expect(message).toBeTruthy();
    });

    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js échec avec message d'erreur 500", async () => {
      BaseDeDonnees.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );

      // Erreur 500
      const html = BillsUI({
        error: "Erreur 500"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 500/);
      // Test de l'erreur message 400
      expect(message).toBeTruthy();
    });
  });
});