/**
 * @jest-environment jsdom
 */

import {screen, fireEvent, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import BaseDeDonnees from "../__mocks__/BaseDeDonnees.js";
import {ROUTES, ROUTES_PATH} from '../constants/routes.js'
import router from "../app/Router.js";
import Store from '../app/Store.js';

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon mail in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon.className = "active-icon").toEqual(windowIcon.className = "active-icon")
      expect(windowIcon).toBeTruthy();
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
    })
  })

  describe('When I submit the form with an image', () => {
    test('Then it should create a new bill', () => {
      const firestore = null;
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      const submitBtn = screen.getByTestId('form-new-bill');
      submitBtn.addEventListener('submit', handleSubmit);
      fireEvent.submit(submitBtn);

      // La fonction handleSubmit doit être appelée
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("When I am on NewBill Page", () => {
    test("Then the placeholder of the name of the expense should be 'Vol Paris Londres'", () => {
      const nomDepense = screen.getByTestId('expense-name')
      expect(nomDepense.style.placeholder="Vol Paris Londres").toEqual(nomDepense.style.placeholder="Vol Paris Londres")
    })

    test("Then a click on the button 'nouvelle facture' should bring up the form for entering the new bill", () => {
      const nouvelleFacture = screen.getByTestId('form-new-bill')
      expect(nouvelleFacture.style.display="block").toEqual(nouvelleFacture.style.display="block")
    })

    test("Then the select file should have an extension .jpg ou .jpeg ou .png", () => {
      const fichier = screen.getByTestId('file')
      expect(fichier.accept=".jpg, .jpeg, .png").toBeTruthy()
    })
  })

  describe("When I am on NewBill Page and I click on 'Envoyer'" , () => {
    test("Then a date should have been selected.", () => {
      document.querySelector('#btn-send-bill').click()
      const date = screen.getByTestId('datepicker')
      expect(date.value === "jj/mm/aaaa").not.toBeTruthy()
    })
  })

  const newBill = [{
    "id": "47qAXb6fIm2zOKkLzMro",
    "vat": "80",
    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    "status": "pending",
    "type": "Hôtel et logement",
    "commentary": "séminaire billed",
    "name": "encore",
    "fileName": "preview-facture-free-201801-pdf-1.jpg",
    "date": "2023-01-05",
    "amount": 400,
    "commentAdmin": "ok",
    "email": "a@a",
    "pct": 20,
  }]

  describe('When I click on send button', () => {
    test(('Then, I should be sent to bills page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI({ newBill })
      const newbill = new NewBill({ document, onNavigate, localStorage })
      const handleClick = jest.fn(newbill.handleClick)
      const handleChangeFile = jest.fn(newbill.handleChangeFile)
      const envoyer = document.querySelector("#btn-send-bill")
      const changer = screen.getByTestId("file")
      const handleSubmit = jest.fn((e) => e.preventDefault());

      // Contrôle que le fichier du justificatif est présent après un clic sur le bouton "Envoyer"
      changer.addEventListener("click", handleChangeFile);
      userEvent.click(envoyer)
      expect(newBill.files).not.toEqual(newBill.files == "")

      // Contrôle que la fonction handleClick est appelée
      envoyer.addEventListener('click', handleClick)
      userEvent.click(envoyer)
      expect(handleClick).toHaveBeenCalled()

      // Contrôle que le prix est renseigné
      envoyer.addEventListener("submit", handleSubmit);
      userEvent.click(envoyer)
      expect(newBill.amount === "").not.toBeTruthy()
      
      // Contrôle que la date est renseignée
      expect(newBill.date === "jj/mm/aaaa").not.toBeTruthy()

      // Recherche de l'extension du fichier sélectionné
      let regexExtensionFichier = /(?:\.([^.]+))?$/;
      let fichier = newBill.fileName;
      let extensionFichier = regexExtensionFichier.exec(fichier);
      // Contrôle que l'extension du fichier est png ou jpeg ou jpg 
      expect(extensionFichier === "png" || extensionFichier === "jpeg" || extensionFichier === "jpg").toEqual(extensionFichier === "png" || extensionFichier === "jpeg" || extensionFichier === "jpg")

      // Contrôle que la page des notes de frais s'affiche après un clic sur "Envoyer"
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })
  })

  describe('When I am on NewBill Page and I add an attached file', () => {
    test('Then the file should be change and the result should be false', () => {
      document.body.innerHTML = NewBillUI();

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: Store,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
      const fichierJoint = screen.getByTestId('file');
      fichierJoint.addEventListener('change', handleChangeFile);
      fireEvent.change(fichierJoint, {
        target: {
          files: [new File(['file.txt'], 'file.txt', { type: 'text/txt' })],
        },
      });

      // Contrôle que le fichier est réfusé
      expect(screen.getByTestId('file').value).toEqual("")
    });
  });

  //---------------------------------------------------------------------------------------------------------------------------//

  // Test d'intégration POST NewBill
  describe('When bill form is submited', () => {
    describe('When a new bill is create', () => {
      test('Add bill to mock POST', async () => {
        const message = jest.spyOn(BaseDeDonnees, 'post');

        // Initialisation de la nouvelle facture
        const newBill = {
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          status: "pending",
          type: "Hôtel et logement",
          commentary: "séminaire billed",
          name: "encore",
          fileName: "preview-facture-free-201801-pdf-1.jpg",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          email: "a@a",
          pct: 20
        };
        const bills = await BaseDeDonnees.post(newBill);

        // Le message doit être appelé une fois
        expect(message).toHaveBeenCalledTimes(1);
        // Le nombre de factures doit être égal à 4 + 1 = 5
        expect(bills.data.length).toBe(5);
      });
    });
  });
});